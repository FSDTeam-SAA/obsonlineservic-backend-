import { z } from "zod";
import { CountryCode, FacilityType, LanguageCode } from "../europarcs/europarcs.constant.js";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const imageSchema = z.object({
    url: z.string().url(),
    alt: z.string().min(1).max(160),
    isPrimary: z.boolean().default(false),
});

const locationSchema = z.object({
    address: z.string().max(240).optional(),
    city: z.string().min(1).max(120),
    region: z.string().min(1).max(120),
    countryCode: z.nativeEnum(CountryCode),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

const ratingSchema = z.object({
    average: z.number().min(0).max(10).default(0),
    count: z.number().int().min(0).default(0),
});

const createParkBody = z.object({
    name: z.string().min(2).max(160),
    slug: slugSchema,
    countryCode: z.nativeEnum(CountryCode),
    region: z.string().min(1).max(120),
    location: locationSchema,
    shortDescription: z.string().min(10).max(280),
    description: z.string().min(20).max(5000),
    facilities: z.array(slugSchema).default([]),
    amenities: z.array(z.string().min(1).max(120)).default([]),
    destinationThemes: z.array(slugSchema).default([]),
    images: z.array(imageSchema).default([]),
    rating: ratingSchema.default({ average: 0, count: 0 }),
    isActive: z.boolean().default(true),
    isPublished: z.boolean().default(false),
}).strict();

const createDestinationBody = z.object({
    name: z.string().min(2).max(160),
    slug: slugSchema,
    locale: z.nativeEnum(LanguageCode).default(LanguageCode.EN),
    category: z.string().min(2).max(120),
    description: z.string().min(10).max(2500),
    image: imageSchema.optional(),
    isPublished: z.boolean().default(false),
}).strict();

const createFacilityBody = z.object({
    name: z.string().min(2).max(160),
    slug: slugSchema,
    type: z.nativeEnum(FacilityType),
    icon: z.string().max(80).optional(),
    isPublished: z.boolean().default(false),
}).strict();

const listParksSchema = z.object({
    query: z.object({
        countryCode: z.nativeEnum(CountryCode).optional(),
        region: z.string().optional(),
        theme: slugSchema.optional(),
        facility: slugSchema.optional(),
        searchTerm: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
    }),
});

const listDestinationsSchema = z.object({
    query: z.object({
        locale: z.nativeEnum(LanguageCode).optional(),
    }),
});

const slugParamsSchema = z.object({
    params: z.object({
        slug: slugSchema,
    }),
});

const idParamsSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
});

const createParkSchema = z.object({ body: createParkBody });
const updateParkSchema = z.object({
    params: idParamsSchema.shape.params,
    body: createParkBody.partial().strict(),
});

const createDestinationSchema = z.object({ body: createDestinationBody });
const updateDestinationSchema = z.object({
    params: idParamsSchema.shape.params,
    body: createDestinationBody.partial().strict(),
});

const createFacilitySchema = z.object({ body: createFacilityBody });
const updateFacilitySchema = z.object({
    params: idParamsSchema.shape.params,
    body: createFacilityBody.partial().strict(),
});

export const ParkValidation = {
    listParksSchema,
    listDestinationsSchema,
    slugParamsSchema,
    idParamsSchema,
    createParkSchema,
    updateParkSchema,
    createDestinationSchema,
    updateDestinationSchema,
    createFacilitySchema,
    updateFacilitySchema,
};
