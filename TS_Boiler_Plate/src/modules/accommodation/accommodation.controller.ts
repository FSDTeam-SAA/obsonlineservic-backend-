import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams, getQuery } from "../../utils/validated.js";
import { AccommodationService } from "./accommodation.service.js";
import type {
    IAccommodationType,
    IAccommodationUnit,
    PublicAccommodationQuery,
} from "./accommodation.interface.js";

const paginationMeta = (meta: { page: number; limit: number; total: number }) => ({
    ...meta,
    totalPage: Math.ceil(meta.total / meta.limit),
});

const getPublicAccommodationTypes = catchAsync(async (req, res) => {
    const result = await AccommodationService.getPublicAccommodationTypes(getQuery<PublicAccommodationQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodation types retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const getPublicAccommodationUnits = catchAsync(async (req, res) => {
    const result = await AccommodationService.getPublicAccommodationUnits(getQuery<PublicAccommodationQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodations retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const getPublicAccommodationUnitBySlug = catchAsync(async (req, res) => {
    const { slug } = getParams<{ slug: string }>(req);
    const result = await AccommodationService.getPublicAccommodationUnitBySlug(slug);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodation retrieved successfully",
        data: result,
    });
});

const getAdminAccommodationUnits = catchAsync(async (req, res) => {
    const result = await AccommodationService.getAdminAccommodationUnits(getQuery<PublicAccommodationQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin accommodations retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const createAccommodationType = catchAsync(async (req, res) => {
    const result = await AccommodationService.createAccommodationType(getBody<IAccommodationType>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Accommodation type created successfully",
        data: result,
    });
});

const updateAccommodationType = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await AccommodationService.updateAccommodationType(id, getBody<Partial<IAccommodationType>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodation type updated successfully",
        data: result,
    });
});

const deleteAccommodationType = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await AccommodationService.deleteAccommodationType(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodation type deleted successfully",
        data: result,
    });
});

const createAccommodationUnit = catchAsync(async (req, res) => {
    const result = await AccommodationService.createAccommodationUnit(getBody<IAccommodationUnit>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Accommodation unit created successfully",
        data: result,
    });
});

const updateAccommodationUnit = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await AccommodationService.updateAccommodationUnit(id, getBody<Partial<IAccommodationUnit>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodation unit updated successfully",
        data: result,
    });
});

const deleteAccommodationUnit = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await AccommodationService.deleteAccommodationUnit(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Accommodation unit deleted successfully",
        data: result,
    });
});

export const AccommodationController = {
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
