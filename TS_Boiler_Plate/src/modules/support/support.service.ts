import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { SupportThread, SupportMessage } from "./support.model.js";

const createThread = async (userId: string, payload: { topic: string; bookingReference?: string; message: string }) => {
    const thread = await SupportThread.create({
        userId,
        topic: payload.topic,
        bookingReference: payload.bookingReference,
        status: "OPEN",
    });

    await SupportMessage.create({
        threadId: thread._id,
        senderRole: "CUSTOMER",
        text: payload.message,
    });

    return thread;
};

const getMyThreads = async (userId: string) => {
    return SupportThread.find({ userId }).sort({ createdAt: -1 }).lean();
};

const getThreadMessages = async (threadId: string, userId: string) => {
    const thread = await SupportThread.findById(threadId).lean();
    if (!thread) throw AppError.of(StatusCodes.NOT_FOUND, "Thread not found");
    if (thread.userId !== userId) throw AppError.of(StatusCodes.FORBIDDEN, "Access denied");

    return SupportMessage.find({ threadId }).sort({ createdAt: 1 }).lean();
};

const addMessageToThread = async (threadId: string, userId: string, text: string) => {
    const thread = await SupportThread.findById(threadId).lean();
    if (!thread) throw AppError.of(StatusCodes.NOT_FOUND, "Thread not found");
    if (thread.userId !== userId) throw AppError.of(StatusCodes.FORBIDDEN, "Access denied");
    if (thread.status === "CLOSED") throw AppError.of(StatusCodes.BAD_REQUEST, "Thread is closed");

    return SupportMessage.create({
        threadId,
        senderRole: "CUSTOMER",
        text,
    });
};

export const SupportService = {
    createThread,
    getMyThreads,
    getThreadMessages,
    addMessageToThread,
};
