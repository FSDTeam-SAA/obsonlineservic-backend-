import type { PriceQuoteInput, PriceQuoteResult, SelectedExtraInput } from "../pricing/pricing.interface.js";

export type BookingStatus = "HELD" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
export type BookingPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type BookingRequestStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "COMPLETED";

export type BookingGuestDetails = {
    adults: number;
    teenagers: number;
    children: number;
    infants: number;
    pets: number;
};

export type BookingCustomerDetails = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postalCode?: string;
    countryCode?: string;
};

export type IBooking = {
    bookingReference: string;
    userId: string;
    customer: BookingCustomerDetails;
    parkSlug: string;
    accommodationUnitSlug: string;
    accommodationTypeSlug: string;
    checkIn: Date;
    checkOut: Date;
    guests: BookingGuestDetails;
    selectedExtras: SelectedExtraInput[];
    priceSnapshot: PriceQuoteResult;
    status: BookingStatus;
    paymentStatus: BookingPaymentStatus;
    paymentIntentId?: string;
    paymentClientSecret?: string;
    availabilityHoldId?: string;
    holdExpiresAt: Date;
    confirmationEmailSentAt?: Date;
};

export type CreateBookingInput = PriceQuoteInput & {
    customer: BookingCustomerDetails;
};

export type ICancellationRequest = {
    bookingId: string;
    bookingReference: string;
    userId: string;
    reason: string;
    status: BookingRequestStatus;
};

export type IRebookingRequest = {
    bookingId: string;
    bookingReference: string;
    userId: string;
    requestedCheckIn: Date;
    requestedCheckOut: Date;
    requestedAccommodationUnitSlug?: string;
    reason?: string;
    isFlexibilityGuaranteeEligible: boolean;
    status: BookingRequestStatus;
};
