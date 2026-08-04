import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getQuery } from "../../utils/validated.js";
import { SearchService } from "./search.service.js";
import type { SearchQuery } from "./search.interface.js";

const search = catchAsync(async (req, res) => {
    const result = await SearchService.search(getQuery<SearchQuery>(req));
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Search results retrieved successfully",
        data: result.data,
        meta: {
            ...result.meta,
            totalPage: Math.ceil(result.meta.total / result.meta.limit),
        },
        extras: {
            map: result.map,
            filterCounts: result.filterCounts,
        },
    });
});

export const SearchController = {
    search,
};
