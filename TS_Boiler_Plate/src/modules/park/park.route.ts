import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { ParkController } from "./park.controller.js";
import { ParkValidation } from "./park.validation.js";

const publicRouter = Router();
const adminRouter = Router();

publicRouter.get("/", validateRequest(ParkValidation.listParksSchema), ParkController.getPublicParks);
publicRouter.get("/destinations", validateRequest(ParkValidation.listDestinationsSchema), ParkController.getPublicDestinations);
publicRouter.get("/facilities", ParkController.getPublicFacilities);
publicRouter.get("/:slug", validateRequest(ParkValidation.slugParamsSchema), ParkController.getPublicParkBySlug);

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
adminRouter.get("/", validateRequest(ParkValidation.listParksSchema), ParkController.getAdminParks);
adminRouter.post("/", validateRequest(ParkValidation.createParkSchema), ParkController.createPark);
adminRouter.patch("/:id", validateRequest(ParkValidation.updateParkSchema), ParkController.updatePark);
adminRouter.delete("/:id", validateRequest(ParkValidation.idParamsSchema), ParkController.deletePark);
adminRouter.post("/destinations", validateRequest(ParkValidation.createDestinationSchema), ParkController.createDestination);
adminRouter.patch("/destinations/:id", validateRequest(ParkValidation.updateDestinationSchema), ParkController.updateDestination);
adminRouter.delete("/destinations/:id", validateRequest(ParkValidation.idParamsSchema), ParkController.deleteDestination);
adminRouter.post("/facilities", validateRequest(ParkValidation.createFacilitySchema), ParkController.createFacility);
adminRouter.patch("/facilities/:id", validateRequest(ParkValidation.updateFacilitySchema), ParkController.updateFacility);
adminRouter.delete("/facilities/:id", validateRequest(ParkValidation.idParamsSchema), ParkController.deleteFacility);

export const ParkRoutes = publicRouter;
export const AdminParkRoutes = adminRouter;
