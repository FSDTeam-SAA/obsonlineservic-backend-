import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { logger } from "../../config/logger.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { getStripe } from "../../payments/stripe.js";
import { AccommodationUnit } from "../accommodation/accommodation.model.js";
import { AvailabilityBlock } from "../availability/availability.model.js";
import { buildAvailabilityOverlapQuery } from "../availability/availability.service.js";
import { PricingService } from "../pricing/pricing.service.js";
import { Booking, CancellationRequest, RebookingRequest } from "./booking.model.js";
import type { CreateBookingInput, IBooking } from "./booking.interface.js";

const HOLD_MINUTES = 15;

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

const bookingReference = (): string => `EP-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

const ensureOwnBooking = async (bookingId: string, userId: string) => {
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) throw AppError.of(StatusCodes.NOT_FOUND, "Booking not found");
    if (booking.userId !== userId) throw AppError.of(StatusCodes.FORBIDDEN, "You cannot access this booking");
    return booking;
};

const ensureUnitAvailable = async (accommodationUnitSlug: string, checkIn: string, checkOut: string) => {
    const overlap = await AvailabilityBlock.findOne({
        accommodationUnitSlug,
        ...buildAvailabilityOverlapQuery(checkIn, checkOut),
    }).lean();

    if (overlap) {
        throw AppError.of(StatusCodes.CONFLICT, "Accommodation is not available for selected dates");
    }
};

const createStripePaymentIntent = async (
    booking: IBooking
): Promise<Partial<Pick<IBooking, "paymentIntentId" | "paymentClientSecret">>> => {
    const stripe = getStripe();
    if (!stripe) return {};

    const amount = Math.round(booking.priceSnapshot.dueToday * 100);
    if (amount <= 0) return {};

    const intent = await stripe.paymentIntents.create({
        amount,
        currency: booking.priceSnapshot.currency.toLowerCase(),
        metadata: {
            bookingReference: booking.bookingReference,
        },
        receipt_email: booking.customer.email,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    const result: Partial<Pick<IBooking, "paymentIntentId" | "paymentClientSecret">> = {
        paymentIntentId: intent.id,
    };
    if (intent.client_secret) result.paymentClientSecret = intent.client_secret;
    return result;
};

const sendBookingConfirmationBestEffort = async (booking: IBooking) => {
    try {
        await sendEmail({
            to: booking.customer.email,
            subject: `Booking received: ${booking.bookingReference}`,
            html: `<p>Hi ${booking.customer.firstName},</p><p>We received your booking request <strong>${booking.bookingReference}</strong>.</p><p>Your stay is held until ${booking.holdExpiresAt.toISOString()}.</p>`,
            text: `Hi ${booking.customer.firstName}, we received your booking request ${booking.bookingReference}. Your stay is held until ${booking.holdExpiresAt.toISOString()}.`,
        });
        await Booking.updateOne({ bookingReference: booking.bookingReference }, { confirmationEmailSentAt: new Date() });
    } catch (err) {
        logger.debug({ err, bookingReference: booking.bookingReference }, "Booking confirmation email skipped or failed");
    }
};

const createBooking = async (userId: string, input: CreateBookingInput) => {
    await ensureUnitAvailable(input.accommodationUnitSlug, input.checkIn, input.checkOut);

    const unit = await AccommodationUnit.findOne({ slug: input.accommodationUnitSlug, isActive: true, isPublished: true }).lean();
    if (!unit) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation unit not found");

    const priceSnapshot = await PricingService.getPriceQuote(input);
    const reference = bookingReference();
    const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    const hold = await AvailabilityBlock.create({
        accommodationUnitId: String(unit._id),
        accommodationUnitSlug: unit.slug,
        parkSlug: unit.parkSlug,
        startDate: toDate(input.checkIn),
        endDate: toDate(input.checkOut),
        type: "HOLD",
        reason: `Temporary hold for booking ${reference}`,
        isActive: true,
    });

    const bookingPayload: IBooking = {
        bookingReference: reference,
        userId,
        customer: input.customer,
        parkSlug: unit.parkSlug,
        accommodationUnitSlug: unit.slug,
        accommodationTypeSlug: unit.accommodationTypeSlug,
        checkIn: toDate(input.checkIn),
        checkOut: toDate(input.checkOut),
        guests: {
            adults: input.guests.adults,
            teenagers: input.guests.teenagers ?? 0,
            children: input.guests.children ?? 0,
            infants: input.guests.infants ?? 0,
            pets: input.guests.pets ?? 0,
        },
        selectedExtras: input.extras ?? [],
        priceSnapshot,
        status: "HELD",
        paymentStatus: "PENDING",
        availabilityHoldId: String(hold._id),
        holdExpiresAt,
    };

    const payment = await createStripePaymentIntent(bookingPayload);
    const bookingCreatePayload: IBooking = {
        ...bookingPayload,
        ...payment,
        status: payment.paymentIntentId ? "PENDING_PAYMENT" : "HELD",
    };

    const created = await Booking.create(bookingCreatePayload);

    await sendBookingConfirmationBestEffort(created.toObject<IBooking>());

    return created;
};

const getMyBookings = async (userId: string, query: Record<string, unknown>) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
    });
    const queryObj = { userId };
    const data = await Booking.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await Booking.countDocuments(queryObj);
    return { meta: { page: pagination.page, limit: pagination.limit, total }, data };
};

const getAdminBookings = async (query: Record<string, unknown>) => {
    const { filters, pagination } = buildApiQuery(query, {
        filterableFields: ["status", "paymentStatus", "parkSlug", "accommodationUnitSlug"],
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
    });
    const data = await Booking.find(filters).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await Booking.countDocuments(filters);
    return { meta: { page: pagination.page, limit: pagination.limit, total }, data };
};

const requestCancellation = async (bookingId: string, userId: string, reason: string) => {
    const booking = await ensureOwnBooking(bookingId, userId);
    return CancellationRequest.create({
        bookingId,
        bookingReference: booking.bookingReference,
        userId,
        reason,
        status: "REQUESTED",
    });
};

const requestRebooking = async (
    bookingId: string,
    userId: string,
    input: { requestedCheckIn: string; requestedCheckOut: string; requestedAccommodationUnitSlug?: string; reason?: string }
) => {
    const booking = await ensureOwnBooking(bookingId, userId);
    const hasFlexExtra = booking.selectedExtras.some(extra => extra.slug === "flexibility-guarantee");
    const payload = {
        bookingId,
        bookingReference: booking.bookingReference,
        userId,
        requestedCheckIn: toDate(input.requestedCheckIn),
        requestedCheckOut: toDate(input.requestedCheckOut),
        isFlexibilityGuaranteeEligible: hasFlexExtra,
        status: "REQUESTED",
        ...(input.requestedAccommodationUnitSlug ? { requestedAccommodationUnitSlug: input.requestedAccommodationUnitSlug } : {}),
        ...(input.reason ? { reason: input.reason } : {}),
    };

    return RebookingRequest.create(payload);
};

const markBookingPaidByPaymentIntent = async (paymentIntentId: string) => {
    const booking = await Booking.findOneAndUpdate(
        { paymentIntentId },
        { paymentStatus: "PAID", status: "CONFIRMED" },
        { new: true }
    ).lean();

    if (!booking) {
        logger.debug({ paymentIntentId }, "No booking found for paid payment intent");
        return null;
    }

    await AvailabilityBlock.updateOne(
        { _id: booking.availabilityHoldId },
        {
            type: "BOOKING",
            reason: `Confirmed booking ${booking.bookingReference}`,
            isActive: true,
        }
    );

    return booking;
};

export const BookingService = {
    createBooking,
    getMyBookings,
    getAdminBookings,
    requestCancellation,
    requestRebooking,
    markBookingPaidByPaymentIntent,
};
