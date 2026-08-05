import { Router } from "express";
import { EuroParcsController } from "./europarcs.controller.js";

const router = Router();

/**
 * @openapi
 * /europarcs/domain-contract:
 *   get:
 *     summary: GET /europarcs/domain-contract
 *     tags:
 *       - EuroParcs
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/domain-contract", EuroParcsController.getDomainContract);

export const EuroParcsRoutes = router;
