import type { DiscountTypeValue } from "../europarcs/europarcs.interface.js";

export type MoneyMode = "FIXED" | "PERCENTAGE";
export type ExtraPriceMode = "PER_STAY" | "PER_NIGHT" | "PER_GUEST" | "PER_PET";
export type PaymentScheduleType = "PAY_NOW" | "PAY_LATER" | "INSTALLMENTS";

export type DateRange = {
    startDate: Date;
    endDate: Date;
};

export type IRatePlan = {
    name: string;
    slug: string;
    accommodationTypeSlug?: string;
    accommodationUnitSlug?: string;
    parkSlug?: string;
    seasonName: string;
    startDate: Date;
    endDate: Date;
    nightlyPrice: number;
    currency: string;
    minimumStayNights: number;
    allowedArrivalDays: number[];
    allowedDepartureDays: number[];
    taxRate: number;
    cleaningFee: number;
    linenFee: number;
    depositAmount: number;
    isActive: boolean;
};

export type IOffer = {
    name: string;
    code?: string;
    slug: string;
    discountType: DiscountTypeValue;
    valueType: MoneyMode;
    value: number;
    startDate: Date;
    endDate: Date;
    parkSlugs: string[];
    accommodationTypeSlugs: string[];
    accommodationUnitSlugs: string[];
    minimumNights?: number;
    isActive: boolean;
};

export type IExtra = {
    name: string;
    slug: string;
    description?: string;
    priceMode: ExtraPriceMode;
    price: number;
    currency: string;
    isMandatory: boolean;
    isActive: boolean;
};

export type SelectedExtraInput = {
    slug: string;
    quantity: number;
};

export type PriceQuoteInput = {
    accommodationUnitSlug: string;
    checkIn: string;
    checkOut: string;
    guests: {
        adults: number;
        teenagers?: number;
        children?: number;
        infants?: number;
        pets?: number;
    };
    extras?: SelectedExtraInput[];
    promoCode?: string;
    paymentScheduleType?: PaymentScheduleType;
};

export type PriceLineItem = {
    label: string;
    type: "ACCOMMODATION" | "DISCOUNT" | "FEE" | "TAX" | "DEPOSIT" | "EXTRA";
    amount: number;
};

export type PriceQuoteResult = {
    currency: string;
    nights: number;
    subtotal: number;
    discountTotal: number;
    feeTotal: number;
    taxTotal: number;
    depositTotal: number;
    extrasTotal: number;
    grandTotal: number;
    dueToday: number;
    paymentScheduleType: PaymentScheduleType;
    lineItems: PriceLineItem[];
};
