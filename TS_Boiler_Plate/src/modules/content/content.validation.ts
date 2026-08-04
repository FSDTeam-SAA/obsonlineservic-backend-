import { z } from "zod";
import { LanguageCode } from "../europarcs/europarcs.constant.js";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const sectionSchema = z.object({
    key: z.string().min(1).max(80),
    title: z.string().max(180).optional(),
    body: z.string().max(5000).optional(),
    imageUrl: z.string().url().optional(),
    ctaLabel: z.string().max(80).optional(),
    ctaUrl: z.string().url().optional(),
});

const contentPageBody = z.object({
    title: z.string().min(2).max(180),
    slug: slugSchema,
    locale: z.nativeEnum(LanguageCode).default(LanguageCode.EN),
    pageType: z.enum(["HOME", "DESTINATION", "CAMPAIGN", "LEGAL", "GALLERY", "CONTACT", "FAQ"]),
    excerpt: z.string().max(320).optional(),
    sections: z.array(sectionSchema).default([]),
    seoTitle: z.string().max(180).optional(),
    seoDescription: z.string().max(320).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    isPublished: z.boolean().default(false),
}).strict();

const faqBody = z.object({
    category: z.enum(["BOOKINGS", "ACCOMMODATIONS", "PAYMENTS", "CANCELLATIONS", "PARKS", "FACILITIES"]),
    question: z.string().min(5).max(300),
    answer: z.string().min(5).max(5000),
    locale: z.nativeEnum(LanguageCode).default(LanguageCode.EN),
    order: z.number().int().min(0).default(0),
    isPublished: z.boolean().default(false),
}).strict();

const contactBody = z.object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().max(80).optional(),
    email: z.string().email(),
    phone: z.string().max(40).optional(),
    topic: z.enum(["BOOKING", "ACCOMMODATION", "PAYMENT", "PARK", "COMPLAINT", "GENERAL"]).default("GENERAL"),
    message: z.string().min(10).max(3000),
}).strict();

const listContentSchema = z.object({
    query: z.object({
        locale: z.nativeEnum(LanguageCode).optional(),
        pageType: z.enum(["HOME", "DESTINATION", "CAMPAIGN", "LEGAL", "GALLERY", "CONTACT", "FAQ"]).optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const listFaqSchema = z.object({
    query: z.object({
        locale: z.nativeEnum(LanguageCode).optional(),
        category: z.enum(["BOOKINGS", "ACCOMMODATIONS", "PAYMENTS", "CANCELLATIONS", "PARKS", "FACILITIES"]).optional(),
    }),
});

const listContactMessagesSchema = z.object({
    query: z.object({
        topic: z.enum(["BOOKING", "ACCOMMODATION", "PAYMENT", "PARK", "COMPLAINT", "GENERAL"]).optional(),
        status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]).optional(),
        email: z.string().email().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const idParams = z.object({ id: z.string().min(1) });
const slugParams = z.object({ slug: slugSchema });

export const ContentValidation = {
    listContentSchema,
    listFaqSchema,
    listContactMessagesSchema,
    getByIdSchema: z.object({ params: idParams }),
    getBySlugSchema: z.object({ params: slugParams, query: z.object({ locale: z.nativeEnum(LanguageCode).optional() }) }),
    createContentPageSchema: z.object({ body: contentPageBody }),
    updateContentPageSchema: z.object({ params: idParams, body: contentPageBody.partial().strict() }),
    createFaqSchema: z.object({ body: faqBody }),
    updateFaqSchema: z.object({ params: idParams, body: faqBody.partial().strict() }),
    createContactSchema: z.object({ body: contactBody }),
    updateContactStatusSchema: z.object({
        params: idParams,
        body: z.object({
            status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
        }).strict(),
    }),
};
