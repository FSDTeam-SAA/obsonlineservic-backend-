import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { EuroParcsService } from "./europarcs.service.js";

const getDomainContract = catchAsync(async (_req, res) => {
    const result = EuroParcsService.getDomainContract();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "EuroParcs domain contract retrieved successfully",
        data: result,
    });
});

export const EuroParcsController = {
    getDomainContract,
};
