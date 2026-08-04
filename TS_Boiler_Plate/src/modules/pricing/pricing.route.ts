import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PricingController } from "./pricing.controller.js";
import { PricingValidation } from "./pricing.validation.js";

const pricingRouter = Router();
const extrasRouter = Router();
const adminRouter = Router();

pricingRouter.post("/quote", validateRequest(PricingValidation.priceQuoteSchema), PricingController.getPriceQuote);
extrasRouter.get("/", PricingController.listPublicExtras);

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
adminRouter.get("/rate-plans", validateRequest(PricingValidation.listSchema), PricingController.listRatePlans);
adminRouter.post("/rate-plans", validateRequest(PricingValidation.createRatePlanSchema), PricingController.createRatePlan);
adminRouter.patch("/rate-plans/:id", validateRequest(PricingValidation.updateRatePlanSchema), PricingController.updateRatePlan);
adminRouter.delete("/rate-plans/:id", validateRequest(PricingValidation.idParamsSchema), PricingController.deleteRatePlan);
adminRouter.get("/offers", validateRequest(PricingValidation.listSchema), PricingController.listOffers);
adminRouter.post("/offers", validateRequest(PricingValidation.createOfferSchema), PricingController.createOffer);
adminRouter.patch("/offers/:id", validateRequest(PricingValidation.updateOfferSchema), PricingController.updateOffer);
adminRouter.delete("/offers/:id", validateRequest(PricingValidation.idParamsSchema), PricingController.deleteOffer);
adminRouter.get("/extras", PricingController.listExtras);
adminRouter.post("/extras", validateRequest(PricingValidation.createExtraSchema), PricingController.createExtra);
adminRouter.patch("/extras/:id", validateRequest(PricingValidation.updateExtraSchema), PricingController.updateExtra);
adminRouter.delete("/extras/:id", validateRequest(PricingValidation.idParamsSchema), PricingController.deleteExtra);

export const PricingRoutes = pricingRouter;
export const ExtrasRoutes = extrasRouter;
export const AdminPricingRoutes = adminRouter;
