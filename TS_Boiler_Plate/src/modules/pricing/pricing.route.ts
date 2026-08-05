import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PricingController } from "./pricing.controller.js";
import { PricingValidation } from "./pricing.validation.js";

const pricingRouter = Router();
const extrasRouter = Router();
const adminRouter = Router();

/**
 * @openapi
 * /pricing/quote:
 *   post:
 *     summary: POST /pricing/quote
 *     tags:
 *       - Pricing
 *     responses:
 *       200:
 *         description: OK
 */
pricingRouter.post("/quote", validateRequest(PricingValidation.priceQuoteSchema), PricingController.getPriceQuote);
/**
 * @openapi
 * /extras:
 *   get:
 *     summary: GET /extras
 *     tags:
 *       - Extras
 *     responses:
 *       200:
 *         description: OK
 */
extrasRouter.get("/", PricingController.listPublicExtras);

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /admin/pricing/rate-plans:
 *   get:
 *     summary: GET /admin/pricing/rate-plans
 *     tags:
 *       - Admin Pricing
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get("/rate-plans", validateRequest(PricingValidation.listSchema), PricingController.listRatePlans);
/**
 * @openapi
 * /admin/pricing/rate-plans:
 *   post:
 *     summary: POST /admin/pricing/rate-plans
 *     tags:
 *       - Admin Pricing
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/rate-plans", validateRequest(PricingValidation.createRatePlanSchema), PricingController.createRatePlan);
/**
 * @openapi
 * /admin/pricing/rate-plans/{id}:
 *   patch:
 *     summary: PATCH /admin/pricing/rate-plans/{id}
 *     tags:
 *       - Admin Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.patch("/rate-plans/:id", validateRequest(PricingValidation.updateRatePlanSchema), PricingController.updateRatePlan);
/**
 * @openapi
 * /admin/pricing/rate-plans/{id}:
 *   delete:
 *     summary: DELETE /admin/pricing/rate-plans/{id}
 *     tags:
 *       - Admin Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.delete("/rate-plans/:id", validateRequest(PricingValidation.idParamsSchema), PricingController.deleteRatePlan);
/**
 * @openapi
 * /admin/pricing/offers:
 *   get:
 *     summary: GET /admin/pricing/offers
 *     tags:
 *       - Admin Pricing
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get("/offers", validateRequest(PricingValidation.listSchema), PricingController.listOffers);
/**
 * @openapi
 * /admin/pricing/offers:
 *   post:
 *     summary: POST /admin/pricing/offers
 *     tags:
 *       - Admin Pricing
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/offers", validateRequest(PricingValidation.createOfferSchema), PricingController.createOffer);
/**
 * @openapi
 * /admin/pricing/offers/{id}:
 *   patch:
 *     summary: PATCH /admin/pricing/offers/{id}
 *     tags:
 *       - Admin Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.patch("/offers/:id", validateRequest(PricingValidation.updateOfferSchema), PricingController.updateOffer);
/**
 * @openapi
 * /admin/pricing/offers/{id}:
 *   delete:
 *     summary: DELETE /admin/pricing/offers/{id}
 *     tags:
 *       - Admin Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.delete("/offers/:id", validateRequest(PricingValidation.idParamsSchema), PricingController.deleteOffer);
/**
 * @openapi
 * /admin/pricing/extras:
 *   get:
 *     summary: GET /admin/pricing/extras
 *     tags:
 *       - Admin Pricing
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get("/extras", PricingController.listExtras);
/**
 * @openapi
 * /admin/pricing/extras:
 *   post:
 *     summary: POST /admin/pricing/extras
 *     tags:
 *       - Admin Pricing
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/extras", validateRequest(PricingValidation.createExtraSchema), PricingController.createExtra);
/**
 * @openapi
 * /admin/pricing/extras/{id}:
 *   patch:
 *     summary: PATCH /admin/pricing/extras/{id}
 *     tags:
 *       - Admin Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.patch("/extras/:id", validateRequest(PricingValidation.updateExtraSchema), PricingController.updateExtra);
/**
 * @openapi
 * /admin/pricing/extras/{id}:
 *   delete:
 *     summary: DELETE /admin/pricing/extras/{id}
 *     tags:
 *       - Admin Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.delete("/extras/:id", validateRequest(PricingValidation.idParamsSchema), PricingController.deleteExtra);

export const PricingRoutes = pricingRouter;
export const ExtrasRoutes = extrasRouter;
export const AdminPricingRoutes = adminRouter;
