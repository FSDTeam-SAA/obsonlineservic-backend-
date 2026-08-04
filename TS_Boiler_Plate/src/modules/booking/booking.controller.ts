import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams, getQuery } from "../../utils/validated.js";
import { BookingService } from "./booking.service.js";
import type { CreateBookingInput } from "./booking.interface.js";

const paginationMeta = (meta: { page: number; limit: number; total: number }) => ({
    ...meta,
    totalPage: Math.ceil(meta.total / meta.limit),
});

const getUserId = (user: unknown): string => {
    const maybeUser = user as { userId?: unknown } | undefined;
    return typeof maybeUser?.userId === "string" ? maybeUser.userId : "";
};

const createBooking = catchAsync(async (req, res) => {
    const result = await BookingService.createBooking(getUserId(req.user), getBody<CreateBookingInput>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Booking created successfully",
        data: result,
    });
});

const getMyBookings = catchAsync(async (req, res) => {
    const result = await BookingService.getMyBookings(getUserId(req.user), getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Bookings retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const getAdminBookings = catchAsync(async (req, res) => {
    const result = await BookingService.getAdminBookings(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin bookings retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const requestCancellation = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const { reason } = getBody<{ reason: string }>(req);
    const result = await BookingService.requestCancellation(id, getUserId(req.user), reason);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Cancellation request created successfully",
        data: result,
    });
});

const requestRebooking = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await BookingService.requestRebooking(
        id,
        getUserId(req.user),
        getBody<{ requestedCheckIn: string; requestedCheckOut: string; requestedAccommodationUnitSlug?: string; reason?: string }>(req)
    );
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Rebooking request created successfully",
        data: result,
    });
});

export const BookingController = {
    createBooking,
    getMyBookings,
    getAdminBookings,
    requestCancellation,
    requestRebooking,
};
