import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getBody, getParams, getQuery } from "../../utils/validated.js";
import { PricingService } from "./pricing.service.js";
import type { IExtra, IOffer, IRatePlan, PriceQuoteInput } from "./pricing.interface.js";

const paginationMeta = (meta: { page: number; limit: number; total: number }) => ({
    ...meta,
    totalPage: Math.ceil(meta.total / meta.limit),
});

const getPriceQuote = catchAsync(async (req, res) => {
    const result = await PricingService.getPriceQuote(getBody<PriceQuoteInput>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Price quote calculated successfully",
        data: result,
    });
});

const listPublicExtras = catchAsync(async (_req, res) => {
    const result = await PricingService.listExtras();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Extras retrieved successfully",
        data: result,
    });
});

const listRatePlans = catchAsync(async (req, res) => {
    const result = await PricingService.listRatePlans(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Rate plans retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const createRatePlan = catchAsync(async (req, res) => {
    const result = await PricingService.createRatePlan(getBody<IRatePlan>(req));
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Rate plan created successfully", data: result });
});

const updateRatePlan = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await PricingService.updateRatePlan(id, getBody<Partial<IRatePlan>>(req));
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Rate plan updated successfully", data: result });
});

const deleteRatePlan = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await PricingService.deleteRatePlan(id);
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Rate plan deleted successfully", data: result });
});

const listOffers = catchAsync(async (req, res) => {
    const result = await PricingService.listOffers(getQuery<Record<string, unknown>>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Offers retrieved successfully",
        data: result.data,
        meta: paginationMeta(result.meta),
    });
});

const createOffer = catchAsync(async (req, res) => {
    const result = await PricingService.createOffer(getBody<IOffer>(req));
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Offer created successfully", data: result });
});

const updateOffer = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await PricingService.updateOffer(id, getBody<Partial<IOffer>>(req));
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Offer updated successfully", data: result });
});

const deleteOffer = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await PricingService.deleteOffer(id);
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Offer deleted successfully", data: result });
});

const listExtras = catchAsync(async (_req, res) => {
    const result = await PricingService.listExtras();
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Admin extras retrieved successfully", data: result });
});

const createExtra = catchAsync(async (req, res) => {
    const result = await PricingService.createExtra(getBody<IExtra>(req));
    sendResponse(res, { statusCode: StatusCodes.CREATED, message: "Extra created successfully", data: result });
});

const updateExtra = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await PricingService.updateExtra(id, getBody<Partial<IExtra>>(req));
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Extra updated successfully", data: result });
});

const deleteExtra = catchAsync(async (req, res) => {
    const { id } = getParams<{ id: string }>(req);
    const result = await PricingService.deleteExtra(id);
    sendResponse(res, { statusCode: StatusCodes.OK, message: "Extra deleted successfully", data: result });
});

export const PricingController = {
    getPriceQuote,
    listPublicExtras,
    listRatePlans,
    createRatePlan,
    updateRatePlan,
    deleteRatePlan,
    listOffers,
    createOffer,
    updateOffer,
    deleteOffer,
    listExtras,
    createExtra,
    updateExtra,
    deleteExtra,
};
