import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams, getQuery } from "../../utils/validated.js";
import { ContentService } from "./content.service.js";
import type { IContactMessage, IContentPage, IFaqItem } from "./content.interface.js";

const paginationMeta = (meta: { page: number; limit: number; total: number }) => ({
    ...meta,
    totalPage: Math.ceil(meta.total / meta.limit),
});

const listPublishedContent = catchAsync(async (req, res) => {
    const result = await ContentService.listPublishedContent(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Content pages retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const getPublishedContentBySlug = catchAsync(async (req, res) => {
    const { slug } = getParams<{ slug: string }>(req);
    const { locale } = getQuery<{ locale?: string }>(req);
    const result = await ContentService.getPublishedContentBySlug(slug, locale);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Content page retrieved successfully",
        data: result,
    });
});

const listPublishedFaqs = catchAsync(async (req, res) => {
    const result = await ContentService.listPublishedFaqs(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "FAQ items retrieved successfully",
        data: result,
    });
});

const createContactMessage = catchAsync(async (req, res) => {
    const result = await ContentService.createContactMessage(getBody<Omit<IContactMessage, "status">>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Contact message submitted successfully",
        data: result,
    });
});

const listAdminContent = catchAsync(async (req, res) => {
    const result = await ContentService.listAdminContent(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin content pages retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const createContentPage = catchAsync(async (req, res) => {
    const result = await ContentService.createContentPage(getBody<IContentPage>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Content page created successfully",
        data: result,
    });
});

const updateContentPage = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ContentService.updateContentPage(id, getBody<Partial<IContentPage>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Content page updated successfully",
        data: result,
    });
});

const deleteContentPage = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ContentService.deleteContentPage(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Content page deleted successfully",
        data: result,
    });
});

const createFaq = catchAsync(async (req, res) => {
    const result = await ContentService.createFaq(getBody<IFaqItem>(req));
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "FAQ item created successfully",
        data: result,
    });
});

const updateFaq = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ContentService.updateFaq(id, getBody<Partial<IFaqItem>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "FAQ item updated successfully",
        data: result,
    });
});

const deleteFaq = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await ContentService.deleteFaq(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "FAQ item deleted successfully",
        data: result,
    });
});

const listContactMessages = catchAsync(async (req, res) => {
    const result = await ContentService.listContactMessages(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Contact messages retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const updateContactStatus = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const { status } = getBody<Pick<IContactMessage, "status">>(req);
    const result = await ContentService.updateContactStatus(id, status);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Contact message updated successfully",
        data: result,
    });
});

export const ContentController = {
    listPublishedContent,
    getPublishedContentBySlug,
    listPublishedFaqs,
    createContactMessage,
    listAdminContent,
    createContentPage,
    updateContentPage,
    deleteContentPage,
    createFaq,
    updateFaq,
    deleteFaq,
    listContactMessages,
    updateContactStatus,
};
