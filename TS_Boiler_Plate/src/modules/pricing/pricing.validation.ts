import { z } from "zod";
import { DiscountType } from "../europarcs/europarcs.constant.js";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const optionalSlugArray = z.array(slugSchema).default([]);
const dateRange = (value: { startDate?: string | undefined; endDate?: string | undefined }) => {
    if (!value.startDate || !value.endDate) return true;
    return new Date(value.startDate) < new Date(value.endDate);
};

const stayDateRange = (value: { checkIn?: string | undefined; checkOut?: string | undefined }) => {
    if (!value.checkIn || !value.checkOut) return true;
    return new Date(value.checkIn) < new Date(value.checkOut);
};

const ratePlanBaseBody = z.object({
    name: z.string().min(2).max(160),
    slug: slugSchema,
    accommodationTypeSlug: slugSchema.optional(),
    accommodationUnitSlug: slugSchema.optional(),
    parkSlug: slugSchema.optional(),
    seasonName: z.string().min(2).max(120),
    startDate: dateSchema,
    endDate: dateSchema,
    nightlyPrice: z.number().min(0),
    currency: z.string().length(3).default("EUR"),
    minimumStayNights: z.number().int().min(1).default(1),
    allowedArrivalDays: z.array(z.number().int().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
    allowedDepartureDays: z.array(z.number().int().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
    taxRate: z.number().min(0).max(1).default(0),
    cleaningFee: z.number().min(0).default(0),
    linenFee: z.number().min(0).default(0),
    depositAmount: z.number().min(0).default(0),
    isActive: z.boolean().default(true),
}).strict();

const offerBaseBody = z.object({
    name: z.string().min(2).max(160),
    code: z.string().min(2).max(40).optional(),
    slug: slugSchema,
    discountType: z.nativeEnum(DiscountType),
    valueType: z.enum(["FIXED", "PERCENTAGE"]),
    value: z.number().min(0),
    startDate: dateSchema,
    endDate: dateSchema,
    parkSlugs: optionalSlugArray,
    accommodationTypeSlugs: optionalSlugArray,
    accommodationUnitSlugs: optionalSlugArray,
    minimumNights: z.number().int().min(1).optional(),
    isActive: z.boolean().default(true),
}).strict();

const extraBody = z.object({
    name: z.string().min(2).max(160),
    slug: slugSchema,
    description: z.string().max(1000).optional(),
    priceMode: z.enum(["PER_STAY", "PER_NIGHT", "PER_GUEST", "PER_PET"]),
    price: z.number().min(0),
    currency: z.string().length(3).default("EUR"),
    isMandatory: z.boolean().default(false),
    isActive: z.boolean().default(true),
}).strict();

const quoteBody = z.object({
    accommodationUnitSlug: slugSchema,
    checkIn: dateSchema,
    checkOut: dateSchema,
    guests: z.object({
        adults: z.number().int().min(0),
        teenagers: z.number().int().min(0).default(0),
        children: z.number().int().min(0).default(0),
        infants: z.number().int().min(0).default(0),
        pets: z.number().int().min(0).default(0),
    }),
    extras: z.array(z.object({
        slug: slugSchema,
        quantity: z.number().int().min(1),
    })).default([]),
    promoCode: z.string().min(2).max(40).optional(),
    paymentScheduleType: z.enum(["PAY_NOW", "PAY_LATER", "INSTALLMENTS"]).default("PAY_NOW"),
}).strict().refine(stayDateRange, {
    message: "checkIn must be before checkOut",
    path: ["checkOut"],
});

const listSchema = z.object({
    query: z.object({
        parkSlug: slugSchema.optional(),
        accommodationTypeSlug: slugSchema.optional(),
        accommodationUnitSlug: slugSchema.optional(),
        code: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});
const idParams = z.object({ id: z.string().min(1) });

export const PricingValidation = {
    listSchema,
    idParamsSchema: z.object({ params: idParams }),
    priceQuoteSchema: z.object({ body: quoteBody }),
    createRatePlanSchema: z.object({ body: ratePlanBaseBody.refine(dateRange, { message: "startDate must be before endDate", path: ["endDate"] }) }),
    updateRatePlanSchema: z.object({ params: idParams, body: ratePlanBaseBody.partial().refine(dateRange, { message: "startDate must be before endDate", path: ["endDate"] }) }),
    createOfferSchema: z.object({ body: offerBaseBody.refine(dateRange, { message: "startDate must be before endDate", path: ["endDate"] }) }),
    updateOfferSchema: z.object({ params: idParams, body: offerBaseBody.partial().refine(dateRange, { message: "startDate must be before endDate", path: ["endDate"] }) }),
    createExtraSchema: z.object({ body: extraBody }),
    updateExtraSchema: z.object({ params: idParams, body: extraBody.partial().strict() }),
};
