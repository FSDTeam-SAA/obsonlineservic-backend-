import { z } from "zod";
import { AccommodationCategory, CountryCode } from "../europarcs/europarcs.constant.js";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const imageSchema = z.object({
    url: z.string().url(),
    alt: z.string().min(1).max(160),
    isPrimary: z.boolean().default(false),
});

const capacitySchema = z.object({
    adults: z.number().int().min(0).default(0),
    teenagers: z.number().int().min(0).default(0),
    children: z.number().int().min(0).default(0),
    infants: z.number().int().min(0).default(0),
    pets: z.number().int().min(0).default(0),
    maxOccupancy: z.number().int().min(1),
});

const roomSummarySchema = z.object({
    bedrooms: z.number().int().min(0).default(0),
    bathrooms: z.number().int().min(0).default(0),
    toilets: z.number().int().min(0).optional(),
});

const featureSetSchema = z.object({
    hasWifi: z.boolean().default(true),
    hasKitchen: z.boolean().default(true),
    hasPrivateSanitary: z.boolean().default(false),
    hasWellness: z.boolean().default(false),
    isWheelchairAccessible: z.boolean().default(false),
    isPetFriendly: z.boolean().default(false),
    allowsPreferredHouseNumber: z.boolean().default(false),
});

const createAccommodationTypeBody = z.object({
    name: z.string().min(2).max(160),
    slug: slugSchema,
    category: z.nativeEnum(AccommodationCategory),
    shortDescription: z.string().min(10).max(280),
    description: z.string().min(20).max(5000),
    defaultCapacity: capacitySchema,
    roomSummary: roomSummarySchema,
    features: featureSetSchema,
    images: z.array(imageSchema).default([]),
    labels: z.array(z.string().min(1).max(80)).default([]),
    isPublished: z.boolean().default(false),
}).strict();

const createAccommodationUnitBody = z.object({
    name: z.string().min(2).max(160),
    unitCode: z.string().min(2).max(80),
    slug: slugSchema,
    parkId: z.string().min(1),
    parkSlug: slugSchema,
    accommodationTypeId: z.string().min(1),
    accommodationTypeSlug: slugSchema,
    category: z.nativeEnum(AccommodationCategory),
    countryCode: z.nativeEnum(CountryCode),
    region: z.string().min(1).max(120),
    capacity: capacitySchema,
    roomSummary: roomSummarySchema,
    features: featureSetSchema,
    amenities: z.array(z.string().min(1).max(120)).default([]),
    images: z.array(imageSchema).default([]),
    baseNightlyPrice: z.number().min(0),
    currency: z.string().length(3).default("EUR"),
    isActive: z.boolean().default(true),
    isPublished: z.boolean().default(false),
}).strict();

const listAccommodationSchema = z.object({
    query: z.object({
        parkSlug: slugSchema.optional(),
        category: z.nativeEnum(AccommodationCategory).optional(),
        countryCode: z.nativeEnum(CountryCode).optional(),
        region: z.string().optional(),
        guests: z.string().optional(),
        pets: z.string().optional(),
        isWheelchairAccessible: z.string().optional(),
        isPetFriendly: z.string().optional(),
        hasWellness: z.string().optional(),
        hasPrivateSanitary: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const slugParams = z.object({ slug: slugSchema });
const idParams = z.object({ id: z.string().min(1) });

export const AccommodationValidation = {
    listAccommodationSchema,
    slugParamsSchema: z.object({ params: slugParams }),
    idParamsSchema: z.object({ params: idParams }),
    createAccommodationTypeSchema: z.object({ body: createAccommodationTypeBody }),
    updateAccommodationTypeSchema: z.object({ params: idParams, body: createAccommodationTypeBody.partial().strict() }),
    createAccommodationUnitSchema: z.object({ body: createAccommodationUnitBody }),
    updateAccommodationUnitSchema: z.object({ params: idParams, body: createAccommodationUnitBody.partial().strict() }),
};
