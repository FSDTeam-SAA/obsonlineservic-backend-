import { z } from "zod";
import { AccommodationCategory, CountryCode } from "../europarcs/europarcs.constant.js";

const slugSchema = z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const csvSlugSchema = z.string().regex(/^[a-z0-9-]+(?:,[a-z0-9-]+)*$/);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const searchQuery = z.object({
    searchTerm: z.string().max(120).optional(),
    countryCode: z.nativeEnum(CountryCode).optional(),
    parkSlug: slugSchema.optional(),
    region: z.string().max(120).optional(),
    category: z.nativeEnum(AccommodationCategory).optional(),
    checkIn: dateSchema.optional(),
    checkOut: dateSchema.optional(),
    adults: z.string().optional(),
    teenagers: z.string().optional(),
    children: z.string().optional(),
    infants: z.string().optional(),
    pets: z.string().optional(),
    facilities: csvSlugSchema.optional(),
    themes: csvSlugSchema.optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    isWheelchairAccessible: z.string().optional(),
    isPetFriendly: z.string().optional(),
    hasWellness: z.string().optional(),
    hasPrivateSanitary: z.string().optional(),
    sortBy: z.enum(["recommended", "baseNightlyPrice", "rating", "capacity", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
}).refine(value => {
    if (!value.checkIn && !value.checkOut) return true;
    if (!value.checkIn || !value.checkOut) return false;
    return new Date(value.checkIn) < new Date(value.checkOut);
}, {
    message: "checkIn and checkOut are required together, and checkIn must be before checkOut",
    path: ["checkOut"],
});

export const SearchValidation = {
    searchSchema: z.object({ query: searchQuery }),
};
