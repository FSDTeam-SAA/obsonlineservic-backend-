import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams, getQuery } from "../../utils/validated.js";
import { ParkService } from "./park.service.js";
import type { IDestinationTheme, IFacility, IHolidayPark, PublicParkQuery } from "./park.interface.js";

const getPublicParks = catchAsync(async (req, res) => {
    const result = await ParkService.getPublicParks(getQuery<PublicParkQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Holiday parks retrieved successfully",
        data: result.data,
        meta: {
            ...result.meta,
            totalPage: Math.ceil(result.meta.total / result.meta.limit),
        },
    });
});

const getPublicParkBySlug = catchAsync(async (req, res) => {
    const { slug } = getParams<{ slug: string }>(req);
    const result = await ParkService.getPublicParkBySlug(slug);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Holiday park retrieved successfully",
        data: result,
    });
});

const getPublicDestinations = catchAsync(async (req, res) => {
    const { locale } = getQuery<{ locale?: string }>(req);
    const result = await ParkService.getPublicDestinations(locale);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Destination themes retrieved successfully",
        data: result,
    });
});

const getPublicFacilities = catchAsync(async (_req, res) => {
    const result = await ParkService.getPublicFacilities();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Facilities retrieved successfully",
        data: result,
    });
});

const getAdminParks = catchAsync(async (req, res) => {
    const result = await ParkService.getAdminParks(getQuery<PublicParkQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin holiday parks retrieved successfully",
        data: result.data,
        meta: {
            ...result.meta,
            totalPage: Math.ceil(result.meta.total / result.meta.limit),
        },
    });
});

const createPark = catchAsync(async (req, res) => {
    const result = await ParkService.createPark(getBody<IHolidayPark>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Holiday park created successfully",
        data: result,
    });
});

const updatePark = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ParkService.updatePark(id, getBody<Partial<IHolidayPark>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Holiday park updated successfully",
        data: result,
    });
});

const deletePark = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ParkService.deletePark(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Holiday park deleted successfully",
        data: result,
    });
});

const createDestination = catchAsync(async (req, res) => {
    const result = await ParkService.createDestination(getBody<IDestinationTheme>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Destination theme created successfully",
        data: result,
    });
});

const updateDestination = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ParkService.updateDestination(id, getBody<Partial<IDestinationTheme>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Destination theme updated successfully",
        data: result,
    });
});

const deleteDestination = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ParkService.deleteDestination(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Destination theme deleted successfully",
        data: result,
    });
});

const createFacility = catchAsync(async (req, res) => {
    const result = await ParkService.createFacility(getBody<IFacility>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Facility created successfully",
        data: result,
    });
});

const updateFacility = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ParkService.updateFacility(id, getBody<Partial<IFacility>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Facility updated successfully",
        data: result,
    });
});

const deleteFacility = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ParkService.deleteFacility(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Facility deleted successfully",
        data: result,
    });
});

export const ParkController = {
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
