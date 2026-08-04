import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams, getQuery } from "../../utils/validated.js";
import { AvailabilityService } from "./availability.service.js";
import type { AvailabilityQuery, IAvailabilityBlock } from "./availability.interface.js";

const paginationMeta = (meta: { page: number; limit: number; total: number }) => ({
    ...meta,
    totalPage: Math.ceil(meta.total / meta.limit),
});

const listAvailabilityBlocks = catchAsync(async (req, res) => {
    const result = await AvailabilityService.listAvailabilityBlocks(getQuery<AvailabilityQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Availability blocks retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const createAvailabilityBlock = catchAsync(async (req, res) => {
    const result = await AvailabilityService.createAvailabilityBlock(getBody<IAvailabilityBlock>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Availability block created successfully",
        data: result,
    });
});

const updateAvailabilityBlock = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await AvailabilityService.updateAvailabilityBlock(id, getBody<Partial<IAvailabilityBlock>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Availability block updated successfully",
        data: result,
    });
});

const deleteAvailabilityBlock = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await AvailabilityService.deleteAvailabilityBlock(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Availability block deleted successfully",
        data: result,
    });
});

export const AvailabilityController = {
    listAvailabilityBlocks,
    createAvailabilityBlock,
    updateAvailabilityBlock,
    deleteAvailabilityBlock,
};
