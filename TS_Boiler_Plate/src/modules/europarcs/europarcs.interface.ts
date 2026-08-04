import type {
    AccommodationCategory,
    BookingStatus,
    CancellationStatus,
    CountryCode,
    DiscountType,
    EuroParcsRole,
    FacilityType,
    GuestAgeGroup,
    LanguageCode,
    PaymentStatus,
    StayType,
} from "./europarcs.constant.js";

export type ValueOf<T> = T[keyof T];

export type EuroParcsRoleValue = ValueOf<typeof EuroParcsRole>;
export type AccommodationCategoryValue = ValueOf<typeof AccommodationCategory>;
export type BookingStatusValue = ValueOf<typeof BookingStatus>;
export type PaymentStatusValue = ValueOf<typeof PaymentStatus>;
export type CancellationStatusValue = ValueOf<typeof CancellationStatus>;
export type FacilityTypeValue = ValueOf<typeof FacilityType>;
export type GuestAgeGroupValue = ValueOf<typeof GuestAgeGroup>;
export type StayTypeValue = ValueOf<typeof StayType>;
export type DiscountTypeValue = ValueOf<typeof DiscountType>;
export type LanguageCodeValue = ValueOf<typeof LanguageCode>;
export type CountryCodeValue = ValueOf<typeof CountryCode>;

export type EuroParcsDomainArea =
    | "catalog"
    | "inventory"
    | "search"
    | "pricing"
    | "booking"
    | "customerPortal"
    | "content"
    | "support"
    | "payments";

export type EuroParcsDomainEntity = {
    key: string;
    module: string;
    area: EuroParcsDomainArea;
    description: string;
    plannedCollection: string;
    ownerRoles: EuroParcsRoleValue[];
    relationships: string[];
};

export type EuroParcsRouteContract = {
    module: string;
    openApiTag: string;
    publicBasePath?: string;
    customerBasePath?: string;
    adminBasePath?: string;
    purpose: string;
};

export type EuroParcsAccessPolicy = {
    role: EuroParcsRoleValue;
    canRead: string[];
    canWrite: string[];
};

export type EuroParcsSharedEnums = {
    accommodationCategories: AccommodationCategoryValue[];
    bookingStatuses: BookingStatusValue[];
    paymentStatuses: PaymentStatusValue[];
    cancellationStatuses: CancellationStatusValue[];
    facilityTypes: FacilityTypeValue[];
    guestAgeGroups: GuestAgeGroupValue[];
    stayTypes: StayTypeValue[];
    discountTypes: DiscountTypeValue[];
    languageCodes: LanguageCodeValue[];
    countryCodes: CountryCodeValue[];
};

export type EuroParcsDomainContract = {
    product: "EuroParcs-like holiday park booking platform";
    version: string;
    phase: "PHASE_1_FOUNDATION_AND_DOMAIN_CONTRACTS";
    routeNamespaces: EuroParcsRouteContract[];
    entities: EuroParcsDomainEntity[];
    accessPolicies: EuroParcsAccessPolicy[];
    sharedEnums: EuroParcsSharedEnums;
};
