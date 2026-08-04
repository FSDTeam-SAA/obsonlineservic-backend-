import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AccommodationController } from "./accommodation.controller.js";
import { AccommodationValidation } from "./accommodation.validation.js";

const publicRouter = Router();
const adminRouter = Router();

publicRouter.get("/", validateRequest(AccommodationValidation.listAccommodationSchema), AccommodationController.getPublicAccommodationUnits);
publicRouter.get("/types", validateRequest(AccommodationValidation.listAccommodationSchema), AccommodationController.getPublicAccommodationTypes);
publicRouter.get("/:slug", validateRequest(AccommodationValidation.slugParamsSchema), AccommodationController.getPublicAccommodationUnitBySlug);

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
adminRouter.get("/", validateRequest(AccommodationValidation.listAccommodationSchema), AccommodationController.getAdminAccommodationUnits);
adminRouter.post("/types", validateRequest(AccommodationValidation.createAccommodationTypeSchema), AccommodationController.createAccommodationType);
adminRouter.patch("/types/:id", validateRequest(AccommodationValidation.updateAccommodationTypeSchema), AccommodationController.updateAccommodationType);
adminRouter.delete("/types/:id", validateRequest(AccommodationValidation.idParamsSchema), AccommodationController.deleteAccommodationType);
adminRouter.post("/units", validateRequest(AccommodationValidation.createAccommodationUnitSchema), AccommodationController.createAccommodationUnit);
adminRouter.patch("/units/:id", validateRequest(AccommodationValidation.updateAccommodationUnitSchema), AccommodationController.updateAccommodationUnit);
adminRouter.delete("/units/:id", validateRequest(AccommodationValidation.idParamsSchema), AccommodationController.deleteAccommodationUnit);

export const AccommodationRoutes = publicRouter;
export const AdminAccommodationRoutes = adminRouter;
