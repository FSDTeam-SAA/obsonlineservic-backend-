import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError.js";
import { buildApiQuery } from "../../utils/apiFeatures.js";
import { ContactMessage, ContentPage, FaqItem } from "./content.model.js";
import type { IContactMessage, IContentPage, IFaqItem } from "./content.interface.js";

const listPublishedContent = async (query: Record<string, unknown>) => {
    const { filters, pagination } = buildApiQuery(query, {
        filterableFields: ["locale", "pageType"],
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
    });
    const queryObj = { ...filters, isPublished: true, status: "PUBLISHED" };
    const data = await ContentPage.find(queryObj).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await ContentPage.countDocuments(queryObj);

    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const getPublishedContentBySlug = async (slug: string, locale = "EN") => {
    const result = await ContentPage.findOne({ slug, locale, isPublished: true, status: "PUBLISHED" }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Content page not found");
    return result;
};

const listPublishedFaqs = async (query: Record<string, unknown>) => {
    const { filters } = buildApiQuery(query, {
        filterableFields: ["locale", "category"],
    });
    return FaqItem.find({ ...filters, isPublished: true }).sort({ category: 1, order: 1 }).lean();
};

const createContactMessage = async (payload: Omit<IContactMessage, "status">) => {
    return ContactMessage.create({ ...payload, status: "NEW" });
};

const listAdminContent = async (query: Record<string, unknown>) => {
    const { filters, pagination } = buildApiQuery(query, {
        filterableFields: ["locale", "pageType"],
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
    });
    const data = await ContentPage.find(filters).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await ContentPage.countDocuments(filters);
    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const createContentPage = async (payload: IContentPage) => {
    return ContentPage.create(payload);
};

const updateContentPage = async (id: string, payload: Partial<IContentPage>) => {
    const result = await ContentPage.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Content page not found");
    return result;
};

const deleteContentPage = async (id: string) => {
    const result = await ContentPage.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Content page not found");
    return result;
};

const createFaq = async (payload: IFaqItem) => {
    return FaqItem.create(payload);
};

const updateFaq = async (id: string, payload: Partial<IFaqItem>) => {
    const result = await FaqItem.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "FAQ item not found");
    return result;
};

const deleteFaq = async (id: string) => {
    const result = await FaqItem.findByIdAndDelete(id).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "FAQ item not found");
    return result;
};

const listContactMessages = async (query: Record<string, unknown>) => {
    const { filters, pagination } = buildApiQuery(query, {
        filterableFields: ["topic", "status", "email"],
        defaultLimit: 20,
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
    });
    const data = await ContactMessage.find(filters).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit).lean();
    const total = await ContactMessage.countDocuments(filters);
    return {
        meta: {
            page: pagination.page,
            limit: pagination.limit,
            total,
        },
        data,
    };
};

const updateContactStatus = async (id: string, status: IContactMessage["status"]) => {
    const result = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
    if (!result) throw AppError.of(StatusCodes.NOT_FOUND, "Contact message not found");
    return result;
};

export const ContentService = {
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
