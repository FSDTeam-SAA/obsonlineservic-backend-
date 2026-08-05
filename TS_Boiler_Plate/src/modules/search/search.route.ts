import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { SearchController } from "./search.controller.js";
import { SearchValidation } from "./search.validation.js";

const router = Router();

/**
 * @openapi
 * /search:
 *   get:
 *     summary: GET /search
 *     tags:
 *       - Search
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", validateRequest(SearchValidation.searchSchema), SearchController.search);

export const SearchRoutes = router;
