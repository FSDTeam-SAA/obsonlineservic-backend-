import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { DestinationTheme, Facility, HolidayPark } from "./park.model.js";
import type { IDestinationTheme, IFacility, IHolidayPark, PublicParkQuery } from "./park.interface.js";

const publishedFilter = { isActive: true, isPublished: true };

const buildParkQuery = (query: PublicParkQuery, includeDrafts = false): Record<string, unknown> => {
    const { filters, search } = buildApiQuery(query, {
        searchableFields: ["name", "region", "shortDescription"],
        filterableFields: ["countryCode", "region"],
    });

    const queryObj: Record<string, unknown> = includeDrafts ? { ...filters } : { ...publishedFilter, ...filters };

    if (query.theme) queryObj.destinationThemes = query.theme;
    if (query.facility) queryObj.facilities = query.facility;
    if (search) {
        queryObj.$or = search.fields.map(field => ({
            [field]: { $regex: search.term, $options: "i" },
        }));
    }

    return queryObj;
};

const getPublicParks = async (query: PublicParkQuery) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 12,
        defaultSortBy: "name",
        defaultSortOrder: "asc",
        allowedSortBy: ["name", "region", "createdAt"],
    });
    const queryObj = buildParkQuery(query);

    const data = await HolidayPark.find(queryObj)
        .sort(pagination.sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean();
    const total = await HolidayPark.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const getPublicParkBySlug = async (slug: string) => {
    const result = await HolidayPark.findOne({ slug, ...publishedFilter }).lean();
    if (!result) {
        throw AppError.of(StatusCodes.NOT_FOUND, "Holiday park not found");
    }
    return result;
};

const getPublicDestinations = async (locale?: string) => {
    const query = {
        isPublished: true,
        ...(locale ? { locale } : {}),
    };
    return DestinationTheme.find(query).sort({ category: 1, name: 1 }).lean();
};

const getPublicFacilities = async () => {
    return Facility.find({ isPublished: true }).sort({ type: 1, name: 1 }).lean();
};

const createPark = async (payload: IHolidayPark) => {
    return HolidayPark.create(payload);
};

const updatePark = async (id: string, payload: Partial<IHolidayPark>) => {
    const result = await HolidayPark.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Holiday park not found");
    return result;
};

const deletePark = async (id: string) => {
    const result = await HolidayPark.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Holiday park not found");
    return result;
};

const getAdminParks = async (query: PublicParkQuery) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
        allowedSortBy: ["name", "region", "createdAt"],
    });
    const queryObj = buildParkQuery(query, true);
    const data = await HolidayPark.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await HolidayPark.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const createDestination = async (payload: IDestinationTheme) => {
    return DestinationTheme.create(payload);
};

const updateDestination = async (id: string, payload: Partial<IDestinationTheme>) => {
    const result = await DestinationTheme.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Destination theme not found");
    return result;
};

const deleteDestination = async (id: string) => {
    const result = await DestinationTheme.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Destination theme not found");
    return result;
};

const createFacility = async (payload: IFacility) => {
    return Facility.create(payload);
};

const updateFacility = async (id: string, payload: Partial<IFacility>) => {
    const result = await Facility.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Facility not found");
    return result;
};

const deleteFacility = async (id: string) => {
    const result = await Facility.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Facility not found");
    return result;
};

export const ParkService = {
    getPublicParks,
    getPublicParkBySlug,
    getPublicDestinations,
    getPublicFacilities,
    getAdminParks,
    createPark,
    updatePark,
    deletePark,
    createDestination,
    updateDestination,
    deleteDestination,
    createFacility,
    updateFacility,
    deleteFacility,
};
