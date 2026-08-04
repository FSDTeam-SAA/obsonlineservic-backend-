import { z } from "zod";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const dateRange = (value: { checkIn?: string | undefined; checkOut?: string | undefined }) => {
    if (!value.checkIn || !value.checkOut) return true;
    return new Date(value.checkIn) < new Date(value.checkOut);
};

const customerSchema = z.object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    email: z.string().email(),
    phone: z.string().max(40).optional(),
    addressLine1: z.string().max(160).optional(),
    addressLine2: z.string().max(160).optional(),
    city: z.string().max(120).optional(),
    postalCode: z.string().max(40).optional(),
    countryCode: z.string().length(2).optional(),
}).strict();

const guestsSchema = z.object({
    adults: z.number().int().min(0),
    teenagers: z.number().int().min(0).default(0),
    children: z.number().int().min(0).default(0),
    infants: z.number().int().min(0).default(0),
    pets: z.number().int().min(0).default(0),
});

const createBookingBody = z.object({
    accommodationUnitSlug: slugSchema,
    checkIn: dateSchema,
    checkOut: dateSchema,
    guests: guestsSchema,
    extras: z.array(z.object({
        slug: slugSchema,
        quantity: z.number().int().min(1),
    })).default([]),
    promoCode: z.string().min(2).max(40).optional(),
    paymentScheduleType: z.enum(["PAY_NOW", "PAY_LATER", "INSTALLMENTS"]).default("PAY_NOW"),
    customer: customerSchema,
}).strict().refine(dateRange, {
    message: "checkIn must be before checkOut",
    path: ["checkOut"],
});

const idParams = z.object({ id: z.string().min(1) });

export const BookingValidation = {
    createBookingSchema: z.object({ body: createBookingBody }),
    idParamsSchema: z.object({ params: idParams }),
    cancellationRequestSchema: z.object({
        params: idParams,
        body: z.object({
            reason: z.string().min(10).max(1000),
        }).strict(),
    }),
    rebookingRequestSchema: z.object({
        params: idParams,
        body: z.object({
            requestedCheckIn: dateSchema,
            requestedCheckOut: dateSchema,
            requestedAccommodationUnitSlug: slugSchema.optional(),
            reason: z.string().max(1000).optional(),
        }).strict().refine(value => new Date(value.requestedCheckIn) < new Date(value.requestedCheckOut), {
            message: "requestedCheckIn must be before requestedCheckOut",
            path: ["requestedCheckOut"],
        }),
    }),
};
