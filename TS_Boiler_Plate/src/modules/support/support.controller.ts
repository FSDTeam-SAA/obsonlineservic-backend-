import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams } from "../../utils/validated.js";
import { SupportService } from "./support.service.js";

const getUserId = (user: unknown): string => {
    const maybeUser = user as { userId?: unknown } | undefined;
    return typeof maybeUser?.userId === "string" ? maybeUser.userId : "";
};

const createThread = catchAsync(async (req, res) => {
    const result = await SupportService.createThread(
        getUserId(req.user),
        getBody<{ topic: string; bookingReference?: string; message: string }>(req)
    );
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Support thread created", data: result });
});

const getMyThreads = catchAsync(async (req, res) => {
    const result = await SupportService.getMyThreads(getUserId(req.user));
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Support threads retrieved", data: result });
});

const getThreadMessages = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await SupportService.getThreadMessages(id, getUserId(req.user));
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Messages retrieved", data: result });
});

const addMessageToThread = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const { text } = getBody<{ text: string }>(req);
    const result = await SupportService.addMessageToThread(id, getUserId(req.user), text);
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Message added", data: result });
});

export const SupportController = {
    createThread,
    getMyThreads,
    getThreadMessages,
    addMessageToThread,
};
