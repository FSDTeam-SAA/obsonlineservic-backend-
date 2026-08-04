import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { AvailabilityBlock } from "./availability.model.js";
import type { AvailabilityQuery, IAvailabilityBlock } from "./availability.interface.js";

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

export const buildAvailabilityOverlapQuery = (startDate: string, endDate: string) => ({
    isActive: true,
    startDate: { $lt: toDate(endDate) },
    endDate: { $gt: toDate(startDate) },
});

const buildAvailabilityQuery = (query: AvailabilityQuery): Record<string, unknown> => {
    const { filters } = buildApiQuery(query, {
        filterableFields: ["accommodationUnitSlug", "parkSlug", "type"],
    });
    const queryObj: Record<string, unknown> = { ...filters };

    if (query.startDate && query.endDate) {
        Object.assign(queryObj, buildAvailabilityOverlapQuery(query.startDate, query.endDate));
    }

    return queryObj;
};

const listAvailabilityBlocks = async (query: AvailabilityQuery) => {
    const { pagination } = buildApiQuery(query, {
        defaultLimit: 20,
        defaultSortBy: "startDate",
        defaultSortOrder: "asc",
        allowedSortBy: ["startDate", "endDate", "createdAt"],
    });
    const queryObj = buildAvailabilityQuery(query);
    const data = await AvailabilityBlock.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await AvailabilityBlock.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const createAvailabilityBlock = async (payload: IAvailabilityBlock) => {
    return AvailabilityBlock.create(payload);
};

const updateAvailabilityBlock = async (id: string, payload: Partial<IAvailabilityBlock>) => {
    const result = await AvailabilityBlock.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Availability block not found");
    return result;
};

const deleteAvailabilityBlock = async (id: string) => {
    const result = await AvailabilityBlock.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Availability block not found");
    return result;
};

export const AvailabilityService = {
    listAvailabilityBlocks,
    createAvailabilityBlock,
    updateAvailabilityBlock,
    deleteAvailabilityBlock,
};
