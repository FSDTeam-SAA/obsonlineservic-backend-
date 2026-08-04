import { Schema, model } from "mongoose";
import type { IBooking, ICancellationRequest, IRebookingRequest } from "./booking.interface.js";

const customerSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, trim: true },
        addressLine1: { type: String, trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        countryCode: { type: String, trim: true },
    },
    { _id: false }
);

const guestsSchema = new Schema(
    {
        adults: { type: Number, min: 0, required: true },
        teenagers: { type: Number, min: 0, default: 0 },
        children: { type: Number, min: 0, default: 0 },
        infants: { type: Number, min: 0, default: 0 },
        pets: { type: Number, min: 0, default: 0 },
    },
    { _id: false }
);

const selectedExtraSchema = new Schema(
    {
        slug: { type: String, required: true },
        quantity: { type: Number, min: 1, required: true },
    },
    { _id: false }
);

const bookingSchema = new Schema<IBooking>(
    {
        bookingReference: { type: String, required: true, unique: true, index: true },
        userId: { type: String, required: true, index: true },
        customer: { type: customerSchema, required: true },
        parkSlug: { type: String, required: true, index: true },
        accommodationUnitSlug: { type: String, required: true, index: true },
        accommodationTypeSlug: { type: String, required: true, index: true },
        checkIn: { type: Date, required: true, index: true },
        checkOut: { type: Date, required: true, index: true },
        guests: { type: guestsSchema, required: true },
        selectedExtras: { type: [selectedExtraSchema], default: [] },
        priceSnapshot: { type: Schema.Types.Mixed, required: true },
        status: { type: String, enum: ["HELD", "PENDING_PAYMENT", "CONFIRMED", "CANCELLED", "EXPIRED"], default: "HELD", index: true },
        paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: "PENDING", index: true },
        paymentIntentId: { type: String, index: true },
        paymentClientSecret: { type: String },
        availabilityHoldId: { type: String },
        holdExpiresAt: { type: Date, required: true, index: true },
        confirmationEmailSentAt: { type: Date },
    },
    { timestamps: true }
);

bookingSchema.index({ accommodationUnitSlug: 1, checkIn: 1, checkOut: 1, status: 1 });

const cancellationRequestSchema = new Schema<ICancellationRequest>(
    {
        bookingId: { type: String, required: true, index: true },
        bookingReference: { type: String, required: true, index: true },
        userId: { type: String, required: true, index: true },
        reason: { type: String, required: true, trim: true },
        status: { type: String, enum: ["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"], default: "REQUESTED", index: true },
    },
    { timestamps: true }
);

const rebookingRequestSchema = new Schema<IRebookingRequest>(
    {
        bookingId: { type: String, required: true, index: true },
        bookingReference: { type: String, required: true, index: true },
        userId: { type: String, required: true, index: true },
        requestedCheckIn: { type: Date, required: true },
        requestedCheckOut: { type: Date, required: true },
        requestedAccommodationUnitSlug: { type: String },
        reason: { type: String, trim: true },
        isFlexibilityGuaranteeEligible: { type: Boolean, required: true },
        status: { type: String, enum: ["REQUESTED", "APPROVED", "REJECTED", "COMPLETED"], default: "REQUESTED", index: true },
    },
    { timestamps: true }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
export const CancellationRequest = model<ICancellationRequest>("CancellationRequest", cancellationRequestSchema);
export const RebookingRequest = model<IRebookingRequest>("RebookingRequest", rebookingRequestSchema);
