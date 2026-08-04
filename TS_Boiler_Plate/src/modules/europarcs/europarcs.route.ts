import { Router } from "express";
import { EuroParcsController } from "./europarcs.controller.js";

const router = Router();

router.get("/domain-contract", EuroParcsController.getDomainContract);

export const EuroParcsRoutes = router;
