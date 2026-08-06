import { z } from "zod";

const idParams = z.object({ id: z.string().min(1) });

export const SupportValidation = {
    createThreadSchema: z.object({
        body: z.object({
            topic: z.string().min(3).max(100),
            bookingReference: z.string().optional(),
            message: z.string().min(10).max(2000),
        }).strict(),
    }),
    createMessageSchema: z.object({
        params: idParams,
        body: z.object({
            text: z.string().min(1).max(2000),
        }).strict(),
    }),
    idParamsSchema: z.object({ params: idParams }),
};
