import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { AccommodationUnit } from "../accommodation/accommodation.model.js";
import type { IAccommodationUnit } from "../accommodation/accommodation.interface.js";
import { Extra, Offer, RatePlan } from "./pricing.model.js";
import type {
    IExtra,
    IOffer,
    IRatePlan,
    PaymentScheduleType,
    PriceLineItem,
    PriceQuoteInput,
    PriceQuoteResult,
} from "./pricing.interface.js";

type LeanUnit = IAccommodationUnit & { _id: unknown };
type LeanRatePlan = IRatePlan & { _id: unknown };
type LeanOffer = IOffer & { _id: unknown };
type LeanExtra = IExtra & { _id: unknown };

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

export const calculateNights = (checkIn: string, checkOut: string): number => {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((toDate(checkOut).getTime() - toDate(checkIn).getTime()) / msPerDay);
};

const overlapsStay = (checkIn: string, checkOut: string) => ({
    isActive: true,
    startDate: { $lte: toDate(checkIn) },
    endDate: { $gte: toDate(checkOut) },
});

const findBestRatePlan = async (unit: LeanUnit, checkIn: string, checkOut: string): Promise<LeanRatePlan | null> => {
    return RatePlan.findOne({
        ...overlapsStay(checkIn, checkOut),
        $or: [
            { accommodationUnitSlug: unit.slug },
            { accommodationTypeSlug: unit.accommodationTypeSlug, parkSlug: unit.parkSlug },
            { accommodationTypeSlug: unit.accommodationTypeSlug, parkSlug: { $exists: false } },
        ],
    }).sort({ accommodationUnitSlug: -1, parkSlug: -1, nightlyPrice: 1 }).lean<LeanRatePlan | null>();
};

export const findLowestActiveRateForUnits = async (unitSlugs: string[]): Promise<Record<string, number>> => {
    if (unitSlugs.length === 0) return {};
    const plans = await RatePlan.find({
        isActive: true,
        accommodationUnitSlug: { $in: unitSlugs },
    }).select("accommodationUnitSlug nightlyPrice").lean<Array<Pick<IRatePlan, "accommodationUnitSlug" | "nightlyPrice">>>();

    return plans.reduce<Record<string, number>>((acc, plan) => {
        if (!plan.accommodationUnitSlug) return acc;
        acc[plan.accommodationUnitSlug] = Math.min(acc[plan.accommodationUnitSlug] ?? Number.POSITIVE_INFINITY, plan.nightlyPrice);
        return acc;
    }, {});
};

const offerApplies = (offer: LeanOffer, unit: LeanUnit, nights: number, checkIn: string): boolean => {
    const checkInDate = toDate(checkIn);
    const withinWindow = offer.startDate <= checkInDate && offer.endDate >= checkInDate;
    const meetsNights = offer.minimumNights === undefined || nights >= offer.minimumNights;
    const matchesPark = offer.parkSlugs.length === 0 || offer.parkSlugs.includes(unit.parkSlug);
    const matchesType = offer.accommodationTypeSlugs.length === 0 || offer.accommodationTypeSlugs.includes(unit.accommodationTypeSlug);
    const matchesUnit = offer.accommodationUnitSlugs.length === 0 || offer.accommodationUnitSlugs.includes(unit.slug);
    return withinWindow && meetsNights && matchesPark && matchesType && matchesUnit;
};

const calculateDiscount = (offer: LeanOffer, accommodationSubtotal: number): number => {
    if (offer.valueType === "PERCENTAGE") {
        return Math.min(accommodationSubtotal, accommodationSubtotal * offer.value);
    }
    return Math.min(accommodationSubtotal, offer.value);
};

const calculateExtraAmount = (extra: LeanExtra, quantity: number, nights: number, guestCount: number, petCount: number): number => {
    if (extra.priceMode === "PER_NIGHT") return extra.price * quantity * nights;
    if (extra.priceMode === "PER_GUEST") return extra.price * quantity * guestCount;
    if (extra.priceMode === "PER_PET") return extra.price * quantity * petCount;
    return extra.price * quantity;
};

const dueTodayForSchedule = (grandTotal: number, depositTotal: number, schedule: PaymentScheduleType): number => {
    if (schedule === "PAY_LATER") return depositTotal;
    if (schedule === "INSTALLMENTS") return Math.max(depositTotal, Math.round((grandTotal / 3) * 100) / 100);
    return grandTotal;
};

const getPriceQuote = async (input: PriceQuoteInput): Promise<PriceQuoteResult> => {
    const unit = await AccommodationUnit.findOne({ slug: input.accommodationUnitSlug, isActive: true, isPublished: true }).lean<LeanUnit | null>();
    if (!unit) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation unit not found");

    const nights = calculateNights(input.checkIn, input.checkOut);
    const ratePlan = await findBestRatePlan(unit, input.checkIn, input.checkOut);
    if (!ratePlan) throw AppError.of(StatusCodes.NOT_FOUND, "No active rate plan found for selected dates");
    if (nights < ratePlan.minimumStayNights) throw AppError.of(StatusCodes.BAD_REQUEST, `Minimum stay is ${ratePlan.minimumStayNights} nights`);

    const accommodationSubtotal = ratePlan.nightlyPrice * nights;
    const lineItems: PriceLineItem[] = [
        { label: `${ratePlan.seasonName} nightly rate x ${nights}`, type: "ACCOMMODATION", amount: accommodationSubtotal },
    ];

    const offers = await Offer.find({
        isActive: true,
        ...(input.promoCode ? { code: input.promoCode.toUpperCase() } : {}),
    }).lean<LeanOffer[]>();
    const applicableOffer = offers.find(offer => offerApplies(offer, unit, nights, input.checkIn));
    const discountTotal = applicableOffer ? calculateDiscount(applicableOffer, accommodationSubtotal) : 0;
    if (applicableOffer && discountTotal > 0) {
        lineItems.push({ label: applicableOffer.name, type: "DISCOUNT", amount: -discountTotal });
    }

    const feeTotal = ratePlan.cleaningFee + ratePlan.linenFee;
    if (ratePlan.cleaningFee > 0) lineItems.push({ label: "Cleaning fee", type: "FEE", amount: ratePlan.cleaningFee });
    if (ratePlan.linenFee > 0) lineItems.push({ label: "Linen fee", type: "FEE", amount: ratePlan.linenFee });

    const guestCount = input.guests.adults + (input.guests.teenagers ?? 0) + (input.guests.children ?? 0) + (input.guests.infants ?? 0);
    const petCount = input.guests.pets ?? 0;
    const selectedExtraSlugs = input.extras?.map(extra => extra.slug) ?? [];
    const selectedExtras = selectedExtraSlugs.length > 0 ? await Extra.find({ slug: { $in: selectedExtraSlugs }, isActive: true }).lean<LeanExtra[]>() : [];
    const mandatoryExtras = await Extra.find({ isMandatory: true, isActive: true }).lean<LeanExtra[]>();
    const extrasBySlug = new Map([...selectedExtras, ...mandatoryExtras].map(extra => [extra.slug, extra]));
    const extrasTotal = [...extrasBySlug.values()].reduce((sum, extra) => {
        const selected = input.extras?.find(item => item.slug === extra.slug);
        const quantity = extra.isMandatory ? 1 : selected?.quantity ?? 0;
        const amount = calculateExtraAmount(extra, quantity, nights, guestCount, petCount);
        if (amount > 0) lineItems.push({ label: extra.name, type: "EXTRA", amount });
        return sum + amount;
    }, 0);

    const taxableSubtotal = accommodationSubtotal - discountTotal + feeTotal + extrasTotal;
    const taxTotal = Math.round(taxableSubtotal * ratePlan.taxRate * 100) / 100;
    if (taxTotal > 0) lineItems.push({ label: "Tax", type: "TAX", amount: taxTotal });
    if (ratePlan.depositAmount > 0) lineItems.push({ label: "Deposit", type: "DEPOSIT", amount: ratePlan.depositAmount });

    const grandTotal = Math.max(0, Math.round((taxableSubtotal + taxTotal + ratePlan.depositAmount) * 100) / 100);
    const paymentScheduleType = input.paymentScheduleType ?? "PAY_NOW";

    return {
        currency: ratePlan.currency,
        nights,
        subtotal: accommodationSubtotal,
        discountTotal,
        feeTotal,
        taxTotal,
        depositTotal: ratePlan.depositAmount,
        extrasTotal,
        grandTotal,
        dueToday: dueTodayForSchedule(grandTotal, ratePlan.depositAmount, paymentScheduleType),
        paymentScheduleType,
        lineItems,
    };
};

const listRatePlans = async (query: Record<string, unknown>) => {
    const { filters, pagination } = buildApiQuery(query, {
        filterableFields: ["parkSlug", "accommodationTypeSlug", "accommodationUnitSlug"],
        defaultLimit: 20,
    });
    const data = await RatePlan.find(filters).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await RatePlan.countDocuments(filters);
    return { meta: { page: pagination.page, limit: pagination.limit, total }, data };
};

const listOffers = async (query: Record<string, unknown>) => {
    const { filters, pagination } = buildApiQuery(query, { filterableFields: ["code"], defaultLimit: 20 });
    const data = await Offer.find(filters).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await Offer.countDocuments(filters);
    return { meta: { page: pagination.page, limit: pagination.limit, total }, data };
};

const listExtras = async () => Extra.find({ isActive: true }).sort({ name: 1 }).lean();

export const PricingService = {
    getPriceQuote,
    listRatePlans,
    listOffers,
    listExtras,
    createRatePlan: (payload: IRatePlan) => RatePlan.create(payload),
    updateRatePlan: async (id: string, payload: Partial<IRatePlan>) => {
        const result = await RatePlan.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
        if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Rate plan not found");
        return result;
    },
    deleteRatePlan: async (id: string) => {
        const result = await RatePlan.findByIdAndDelete(id).lean();
        if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Rate plan not found");
        return result;
    },
    createOffer: (payload: IOffer) => Offer.create(payload),
    updateOffer: async (id: string, payload: Partial<IOffer>) => {
        const result = await Offer.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
        if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Offer not found");
        return result;
    },
    deleteOffer: async (id: string) => {
        const result = await Offer.findByIdAndDelete(id).lean();
        if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Offer not found");
        return result;
    },
    createExtra: (payload: IExtra) => Extra.create(payload),
    updateExtra: async (id: string, payload: Partial<IExtra>) => {
        const result = await Extra.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
        if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Extra not found");
        return result;
    },
    deleteExtra: async (id: string) => {
        const result = await Extra.findByIdAndDelete(id).lean();
        if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Extra not found");
        return result;
    },
};
