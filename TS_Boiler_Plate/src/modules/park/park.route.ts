import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { ParkController } from "./park.controller.js";
import { ParkValidation } from "./park.validation.js";

const publicRouter = Router();
const adminRouter = Router();

/**
 * @openapi
 * /parks:
 *   get:
 *     summary: GET /parks
 *     tags:
 *       - Parks
 *     responses:
 *       200:
 *         description: OK
 */
publicRouter.get("/", validateRequest(ParkValidation.listParksSchema), ParkController.getPublicParks);
/**
 * @openapi
 * /parks/destinations:
 *   get:
 *     summary: GET /parks/destinations
 *     tags:
 *       - Parks
 *     responses:
 *       200:
 *         description: OK
 */
publicRouter.get("/destinations", validateRequest(ParkValidation.listDestinationsSchema), ParkController.getPublicDestinations);
/**
 * @openapi
 * /parks/facilities:
 *   get:
 *     summary: GET /parks/facilities
 *     tags:
 *       - Parks
 *     responses:
 *       200:
 *         description: OK
 */
publicRouter.get("/facilities", ParkController.getPublicFacilities);
/**
 * @openapi
 * /parks/{slug}:
 *   get:
 *     summary: GET /parks/{slug}
 *     tags:
 *       - Parks
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
publicRouter.get("/:slug", validateRequest(ParkValidation.slugParamsSchema), ParkController.getPublicParkBySlug);

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /admin/parks:
 *   get:
 *     summary: GET /admin/parks
 *     tags:
 *       - Admin Parks
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get("/", validateRequest(ParkValidation.listParksSchema), ParkController.getAdminParks);
/**
 * @openapi
 * /admin/parks:
 *   post:
 *     summary: POST /admin/parks
 *     tags:
 *       - Admin Parks
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/", validateRequest(ParkValidation.createParkSchema), ParkController.createPark);
/**
 * @openapi
 * /admin/parks/{id}:
 *   patch:
 *     summary: PATCH /admin/parks/{id}
 *     tags:
 *       - Admin Parks
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
adminRouter.patch("/:id", validateRequest(ParkValidation.updateParkSchema), ParkController.updatePark);
/**
 * @openapi
 * /admin/parks/{id}:
 *   delete:
 *     summary: DELETE /admin/parks/{id}
 *     tags:
 *       - Admin Parks
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
adminRouter.delete("/:id", validateRequest(ParkValidation.idParamsSchema), ParkController.deletePark);
/**
 * @openapi
 * /admin/parks/destinations:
 *   post:
 *     summary: POST /admin/parks/destinations
 *     tags:
 *       - Admin Parks
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/destinations", validateRequest(ParkValidation.createDestinationSchema), ParkController.createDestination);
/**
 * @openapi
 * /admin/parks/destinations/{id}:
 *   patch:
 *     summary: PATCH /admin/parks/destinations/{id}
 *     tags:
 *       - Admin Parks
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
adminRouter.patch("/destinations/:id", validateRequest(ParkValidation.updateDestinationSchema), ParkController.updateDestination);
/**
 * @openapi
 * /admin/parks/destinations/{id}:
 *   delete:
 *     summary: DELETE /admin/parks/destinations/{id}
 *     tags:
 *       - Admin Parks
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
adminRouter.delete("/destinations/:id", validateRequest(ParkValidation.idParamsSchema), ParkController.deleteDestination);
/**
 * @openapi
 * /admin/parks/facilities:
 *   post:
 *     summary: POST /admin/parks/facilities
 *     tags:
 *       - Admin Parks
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/facilities", validateRequest(ParkValidation.createFacilitySchema), ParkController.createFacility);
/**
 * @openapi
 * /admin/parks/facilities/{id}:
 *   patch:
 *     summary: PATCH /admin/parks/facilities/{id}
 *     tags:
 *       - Admin Parks
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
adminRouter.patch("/facilities/:id", validateRequest(ParkValidation.updateFacilitySchema), ParkController.updateFacility);
/**
 * @openapi
 * /admin/parks/facilities/{id}:
 *   delete:
 *     summary: DELETE /admin/parks/facilities/{id}
 *     tags:
 *       - Admin Parks
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
adminRouter.delete("/facilities/:id", validateRequest(ParkValidation.idParamsSchema), ParkController.deleteFacility);

export const ParkRoutes = publicRouter;
export const AdminParkRoutes = adminRouter;
