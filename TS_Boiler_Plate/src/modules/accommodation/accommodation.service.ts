import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { AccommodationType, AccommodationUnit } from "./accommodation.model.js";
import type {
    IAccommodationType,
    IAccommodationUnit,
    PublicAccommodationQuery,
} from "./accommodation.interface.js";

const toPositiveInt = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const isTrue = (value: string | undefined): boolean => value === "true";

const buildPublicUnitQuery = (query: PublicAccommodationQuery, includeDrafts = false): Record<string, unknown> => {
    const { filters } = buildApiQuery(query, {
        filterableFields: ["parkSlug", "category", "countryCode", "region"],
    });
    const queryObj: Record<string, unknown> = includeDrafts ? { ...filters } : { ...filters, isActive: true, isPublished: true };
    const guests = toPositiveInt(query.guests);
    const pets = toPositiveInt(query.pets);

    if (guests) queryObj["capacity.maxOccupancy"] = { $gte: guests };
    if (pets) {
        queryObj["capacity.pets"] = { $gte: pets };
        queryObj["features.isPetFriendly"] = true;
    }
    if (isTrue(query.isWheelchairAccessible)) queryObj["features.isWheelchairAccessible"] = true;
    if (isTrue(query.isPetFriendly)) queryObj["features.isPetFriendly"] = true;
    if (isTrue(query.hasWellness)) queryObj["features.hasWellness"] = true;
    if (isTrue(query.hasPrivateSanitary)) queryObj["features.hasPrivateSanitary"] = true;

    return queryObj;
};

const getPublicAccommodationTypes = async (query: PublicAccommodationQuery) => {
    const { filters, pagination } = buildApiQuery(query, {
        filterableFields: ["category"],
        defaultLimit: 20,
        defaultSortBy: "name",
        defaultSortOrder: "asc",
        allowedSortBy: ["name", "createdAt"],
    });
    const queryObj = { ...filters, isPublished: true };
    const data = await AccommodationType.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await AccommodationType.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const getPublicAccommodationUnits = async (query: PublicAccommodationQuery) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 20,
        defaultSortBy: "baseNightlyPrice",
        defaultSortOrder: "asc",
        allowedSortBy: ["baseNightlyPrice", "name", "createdAt"],
    });
    const queryObj = buildPublicUnitQuery(query);
    const data = await AccommodationUnit.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await AccommodationUnit.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const getPublicAccommodationUnitBySlug = async (slug: string) => {
    const result = await AccommodationUnit.findOne({ slug, isActive: true, isPublished: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation not found");
    return result;
};

const getAdminAccommodationUnits = async (query: PublicAccommodationQuery) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
        allowedSortBy: ["baseNightlyPrice", "name", "createdAt"],
    });
    const queryObj = buildPublicUnitQuery(query, true);
    const data = await AccommodationUnit.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await AccommodationUnit.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const createAccommodationType = async (payload: IAccommodationType) => {
    return AccommodationType.create(payload);
};

const updateAccommodationType = async (id: string, payload: Partial<IAccommodationType>) => {
    const result = await AccommodationType.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation type not found");
    return result;
};

const deleteAccommodationType = async (id: string) => {
    const result = await AccommodationType.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation type not found");
    return result;
};

const createAccommodationUnit = async (payload: IAccommodationUnit) => {
    return AccommodationUnit.create(payload);
};

const updateAccommodationUnit = async (id: string, payload: Partial<IAccommodationUnit>) => {
    const result = await AccommodationUnit.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation unit not found");
    return result;
};

const deleteAccommodationUnit = async (id: string) => {
    const result = await AccommodationUnit.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Accommodation unit not found");
    return result;
};

export const AccommodationService = {
    getPublicAccommodationTypes,
    getPublicAccommodationUnits,
    getPublicAccommodationUnitBySlug,
    getAdminAccommodationUnits,
    createAccommodationType,
    updateAccommodationType,
    deleteAccommodationType,
    createAccommodationUnit,
    updateAccommodationUnit,
    deleteAccommodationUnit,
};
