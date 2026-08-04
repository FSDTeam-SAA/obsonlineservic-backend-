import type { SortOrder } from "mongoose";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { AccommodationUnit } from "../accommodation/accommodation.model.js";
import type { IAccommodationUnit } from "../accommodation/accommodation.interface.js";
import { AvailabilityBlock } from "../availability/availability.model.js";
import { buildAvailabilityOverlapQuery } from "../availability/availability.service.js";
import { HolidayPark } from "../park/park.model.js";
import type { IHolidayPark } from "../park/park.interface.js";
import { findLowestActiveRateForUnits } from "../pricing/pricing.service.js";
import type { SearchFilterCounts, SearchMapMarker, SearchQuery } from "./search.interface.js";

type LeanUnit = IAccommodationUnit & { _id: unknown };
type LeanPark = IHolidayPark & { _id: unknown };

const toPositiveInt = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const toMoney = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const isTrue = (value: string | undefined): boolean => value === "true";

const splitCsv = (value: string | undefined): string[] => {
    if (!value) return [];
    return value.split(",").map(item => item.trim()).filter(Boolean);
};

const requestedGuests = (query: SearchQuery): number => {
    return ["adults", "teenagers", "children", "infants"]
        .map(key => toPositiveInt(query[key as keyof SearchQuery]))
        .reduce<number>((sum, value) => sum + (value ?? 0), 0);
};

export const buildSearchUnitQuery = (
    query: SearchQuery,
    excludedUnitIds: string[],
    parkSlugsFromContentFilters: string[]
): Record<string, unknown> => {
    const { filters, search } = buildApiQuery(query, {
        searchableFields: ["name", "region", "amenities"],
        filterableFields: ["countryCode", "parkSlug", "region", "category"],
    });
    const queryObj: Record<string, unknown> = { ...filters, isActive: true, isPublished: true };
    const totalGuests = requestedGuests(query);
    const pets = toPositiveInt(query.pets);
    const minPrice = toMoney(query.minPrice);
    const maxPrice = toMoney(query.maxPrice);

    if (excludedUnitIds.length > 0) {
        queryObj._id = { $nin: excludedUnitIds };
    }
    if (parkSlugsFromContentFilters.length > 0) {
        queryObj.parkSlug = { $in: parkSlugsFromContentFilters };
    }
    if (totalGuests > 0) queryObj["capacity.maxOccupancy"] = { $gte: totalGuests };
    if (pets) {
        queryObj["capacity.pets"] = { $gte: pets };
        queryObj["features.isPetFriendly"] = true;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        queryObj.baseNightlyPrice = {
            ...(minPrice !== undefined ? { $gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
        };
    }
    if (isTrue(query.isWheelchairAccessible)) queryObj["features.isWheelchairAccessible"] = true;
    if (isTrue(query.isPetFriendly)) queryObj["features.isPetFriendly"] = true;
    if (isTrue(query.hasWellness)) queryObj["features.hasWellness"] = true;
    if (isTrue(query.hasPrivateSanitary)) queryObj["features.hasPrivateSanitary"] = true;
    if (search) {
        queryObj.$or = search.fields.map(field => ({
            [field]: { $regex: search.term, $options: "i" },
        }));
    }

    return queryObj;
};

const getExcludedUnitIds = async (query: SearchQuery): Promise<string[]> => {
    if (!query.checkIn || !query.checkOut) return [];
    const blocks = await AvailabilityBlock.find(buildAvailabilityOverlapQuery(query.checkIn, query.checkOut))
        .select("accommodationUnitId")
        .lean();
    return blocks.map(block => block.accommodationUnitId);
};

const getParkSlugsFromContentFilters = async (query: SearchQuery): Promise<string[]> => {
    const facilities = splitCsv(query.facilities);
    const themes = splitCsv(query.themes);
    if (facilities.length === 0 && themes.length === 0) return [];

    const parkQuery: Record<string, unknown> = { isActive: true, isPublished: true };
    if (facilities.length > 0) parkQuery.facilities = { $all: facilities };
    if (themes.length > 0) parkQuery.destinationThemes = { $all: themes };

    const parks = await HolidayPark.find(parkQuery).select("slug").lean();
    return parks.map(park => park.slug);
};

const sortForSearch = (query: SearchQuery): Record<string, SortOrder> => {
    if (query.sortBy === "rating") return { "rating.average": query.sortOrder === "asc" ? 1 : -1 };
    if (query.sortBy === "capacity") return { "capacity.maxOccupancy": query.sortOrder === "desc" ? -1 : 1 };
    if (query.sortBy === "createdAt") return { createdAt: query.sortOrder === "asc" ? 1 : -1 };
    return { baseNightlyPrice: query.sortOrder === "desc" ? -1 : 1 };
};

const increment = (bucket: Record<string, number>, key: string) => {
    bucket[key] = (bucket[key] ?? 0) + 1;
};

const buildFilterCounts = (units: LeanUnit[]): SearchFilterCounts => {
    const counts: SearchFilterCounts = {
        categories: {},
        countries: {},
        regions: {},
        parks: {},
        features: {
            isPetFriendly: 0,
            isWheelchairAccessible: 0,
            hasWellness: 0,
            hasPrivateSanitary: 0,
        },
    };

    for (const unit of units) {
        increment(counts.categories, unit.category);
        increment(counts.countries, unit.countryCode);
        increment(counts.regions, unit.region);
        increment(counts.parks, unit.parkSlug);
        if (unit.features.isPetFriendly) counts.features.isPetFriendly += 1;
        if (unit.features.isWheelchairAccessible) counts.features.isWheelchairAccessible += 1;
        if (unit.features.hasWellness) counts.features.hasWellness += 1;
        if (unit.features.hasPrivateSanitary) counts.features.hasPrivateSanitary += 1;
    }

    return counts;
};

const buildMapMarkers = (units: LeanUnit[], parks: LeanPark[]): SearchMapMarker[] => {
    const resultCountByPark = units.reduce<Record<string, number>>((acc, unit) => {
        acc[unit.parkSlug] = (acc[unit.parkSlug] ?? 0) + 1;
        return acc;
    }, {});

    return parks.flatMap(park => {
        const latitude = park.location.latitude;
        const longitude = park.location.longitude;
        const resultCount = resultCountByPark[park.slug] ?? 0;
        if (latitude === undefined || longitude === undefined || resultCount === 0) return [];
        return [{
            parkSlug: park.slug,
            parkName: park.name,
            latitude,
            longitude,
            resultCount,
        }];
    });
};

const search = async (query: SearchQuery) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 20,
        maxLimit: 100,
        defaultSortBy: "baseNightlyPrice",
        defaultSortOrder: "asc",
    });
    const excludedUnitIds = await getExcludedUnitIds(query);
    const parkSlugsFromContentFilters = await getParkSlugsFromContentFilters(query);
    const queryObj = buildSearchUnitQuery(query, excludedUnitIds, parkSlugsFromContentFilters);
    const sort = sortForSearch(query);
    const [data, total, matchedUnits] = await Promise.all([
        AccommodationUnit.find(queryObj).sort(sort).skip(pagination.skip).limit(pagination.limit).lean<LeanUnit[]>(),
        AccommodationUnit.countDocuments(queryObj),
        AccommodationUnit.find(queryObj).limit(500).lean<LeanUnit[]>(),
    ]);
    const parkSlugs = [...new Set(matchedUnits.map(unit => unit.parkSlug))];
    const rateLookup = await findLowestActiveRateForUnits(matchedUnits.map(unit => unit.slug));
    const parks = parkSlugs.length > 0
        ? await HolidayPark.find({ slug: { $in: parkSlugs }, isActive: true, isPublished: true }).lean<LeanPark[]>()
        : [];
    const dataWithRatePlan = data.map(unit => ({
        ...unit,
        ratePlan: {
            fromNightlyPrice: rateLookup[unit.slug] ?? unit.baseNightlyPrice,
            currency: unit.currency,
        },
    }));

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data: dataWithRatePlan,
        map: buildMapMarkers(matchedUnits, parks),
        filterCounts: buildFilterCounts(matchedUnits),
    };
};

export const SearchService = {
    search,
};
