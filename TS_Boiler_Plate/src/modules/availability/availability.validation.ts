import { z } from "zod";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const dateRangeRefinement = (value: { startDate?: string | undefined; endDate?: string | undefined }) => {
    if (!value.startDate || !value.endDate) return true;
    return new Date(value.startDate) < new Date(value.endDate);
};

const availabilityBlockBaseBody = z.object({
    accommodationUnitId: z.string().min(1),
    accommodationUnitSlug: slugSchema,
    parkSlug: slugSchema,
    startDate: dateSchema,
    endDate: dateSchema,
    type: z.enum(["BOOKING", "HOLD", "MAINTENANCE", "OWNER_USE"]),
    reason: z.string().max(240).optional(),
    isActive: z.boolean().default(true),
}).strict();

const availabilityBlockBody = availabilityBlockBaseBody.refine(dateRangeRefinement, {
    message: "startDate must be before endDate",
    path: ["endDate"],
});

const listAvailabilitySchema = z.object({
    query: z.object({
        accommodationUnitSlug: slugSchema.optional(),
        parkSlug: slugSchema.optional(),
        startDate: dateSchema.optional(),
        endDate: dateSchema.optional(),
        type: z.enum(["BOOKING", "HOLD", "MAINTENANCE", "OWNER_USE"]).optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }).refine(dateRangeRefinement, {
        message: "startDate must be before endDate",
        path: ["endDate"],
    }),
});

const idParams = z.object({ id: z.string().min(1) });

export const AvailabilityValidation = {
    listAvailabilitySchema,
    idParamsSchema: z.object({ params: idParams }),
    createAvailabilityBlockSchema: z.object({ body: availabilityBlockBody }),
    updateAvailabilityBlockSchema: z.object({
        params: idParams,
        body: availabilityBlockBaseBody.partial().refine(dateRangeRefinement, {
            message: "startDate must be before endDate",
            path: ["endDate"],
        }),
    }),
};
