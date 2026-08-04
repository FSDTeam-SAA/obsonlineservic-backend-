import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { SearchController } from "./search.controller.js";
import { SearchValidation } from "./search.validation.js";

const router = Router();

router.get("/", validateRequest(SearchValidation.searchSchema), SearchController.search);

export const SearchRoutes = router;
