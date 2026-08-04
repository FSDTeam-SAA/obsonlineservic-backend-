export const EUROPARCS_CONTRACT_VERSION = "2026-08-04.phase-1" as const;

export const EuroParcsRole = {
    PUBLIC: "PUBLIC",
    CUSTOMER: "CUSTOMER",
    SUPPORT: "SUPPORT",
    CONTENT_EDITOR: "CONTENT_EDITOR",
    ADMIN: "ADMIN",
} as const;

export const AccommodationCategory = {
    HOLIDAY_HOME: "HOLIDAY_HOME",
    CHALET: "CHALET",
    VILLA: "VILLA",
    COTTAGE: "COTTAGE",
    APARTMENT: "APARTMENT",
    GLAMPING: "GLAMPING",
    TINY_HOUSE: "TINY_HOUSE",
    GROUP_ACCOMMODATION: "GROUP_ACCOMMODATION",
    WELLNESS_HOME: "WELLNESS_HOME",
    ACCESSIBLE_HOME: "ACCESSIBLE_HOME",
    CAMPSITE: "CAMPSITE",
} as const;

export const BookingStatus = {
    DRAFT: "DRAFT",
    HELD: "HELD",
    PENDING_PAYMENT: "PENDING_PAYMENT",
    CONFIRMED: "CONFIRMED",
    CHECKED_IN: "CHECKED_IN",
    CHECKED_OUT: "CHECKED_OUT",
    CANCELLED: "CANCELLED",
    EXPIRED: "EXPIRED",
} as const;

export const PaymentStatus = {
    NOT_REQUIRED: "NOT_REQUIRED",
    PENDING: "PENDING",
    PARTIALLY_PAID: "PARTIALLY_PAID",
    PAID: "PAID",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
} as const;

export const CancellationStatus = {
    NOT_REQUESTED: "NOT_REQUESTED",
    REQUESTED: "REQUESTED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED",
} as const;

export const FacilityType = {
    PARK: "PARK",
    ACCOMMODATION: "ACCOMMODATION",
    ACCESSIBILITY: "ACCESSIBILITY",
    FAMILY: "FAMILY",
    PETS: "PETS",
    WELLNESS: "WELLNESS",
    FOOD_AND_DRINK: "FOOD_AND_DRINK",
    SPORTS_AND_PLAY: "SPORTS_AND_PLAY",
} as const;

export const GuestAgeGroup = {
    ADULT: "ADULT",
    TEENAGER: "TEENAGER",
    CHILD: "CHILD",
    INFANT: "INFANT",
    PET: "PET",
} as const;

export const StayType = {
    ACCOMMODATION: "ACCOMMODATION",
    CAMPING: "CAMPING",
} as const;

export const DiscountType = {
    SALE: "SALE",
    EARLY_BIRD: "EARLY_BIRD",
    LAST_MINUTE: "LAST_MINUTE",
    PACKAGE: "PACKAGE",
    PROMO_CODE: "PROMO_CODE",
} as const;

export const LanguageCode = {
    EN: "EN",
    NL: "NL",
    DE: "DE",
    FR: "FR",
} as const;

export const CountryCode = {
    NL: "NL",
    BE: "BE",
    DE: "DE",
    AT: "AT",
    LU: "LU",
} as const;

export const EuroParcsRouteNamespace = {
    PARKS: "/api/v1/parks",
    ACCOMMODATIONS: "/api/v1/accommodations",
    SEARCH: "/api/v1/search",
    AVAILABILITY: "/api/v1/availability",
    BOOKINGS: "/api/v1/bookings",
    EXTRAS: "/api/v1/extras",
    OFFERS: "/api/v1/offers",
    REVIEWS: "/api/v1/reviews",
    CONTENT: "/api/v1/content",
    FAQ: "/api/v1/faq",
    CONTACT: "/api/v1/contact",
    PAYMENTS: "/api/v1/payments",
} as const;
