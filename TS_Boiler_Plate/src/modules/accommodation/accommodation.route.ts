import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AccommodationController } from "./accommodation.controller.js";
import { AccommodationValidation } from "./accommodation.validation.js";

const publicRouter = Router();
const adminRouter = Router();

/**
 * @openapi
 * /accommodations:
 *   get:
 *     summary: GET /accommodations
 *     tags:
 *       - Accommodations
 *     responses:
 *       200:
 *         description: OK
 */
publicRouter.get("/", validateRequest(AccommodationValidation.listAccommodationSchema), AccommodationController.getPublicAccommodationUnits);
/**
 * @openapi
 * /accommodations/types:
 *   get:
 *     summary: GET /accommodations/types
 *     tags:
 *       - Accommodations
 *     responses:
 *       200:
 *         description: OK
 */
publicRouter.get("/types", validateRequest(AccommodationValidation.listAccommodationSchema), AccommodationController.getPublicAccommodationTypes);
/**
 * @openapi
 * /accommodations/{slug}:
 *   get:
 *     summary: GET /accommodations/{slug}
 *     tags:
 *       - Accommodations
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
publicRouter.get("/:slug", validateRequest(AccommodationValidation.slugParamsSchema), AccommodationController.getPublicAccommodationUnitBySlug);

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /admin/accommodations:
 *   get:
 *     summary: GET /admin/accommodations
 *     tags:
 *       - Admin Accommodations
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get("/", validateRequest(AccommodationValidation.listAccommodationSchema), AccommodationController.getAdminAccommodationUnits);
/**
 * @openapi
 * /admin/accommodations/types:
 *   post:
 *     summary: POST /admin/accommodations/types
 *     tags:
 *       - Admin Accommodations
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/types", validateRequest(AccommodationValidation.createAccommodationTypeSchema), AccommodationController.createAccommodationType);
/**
 * @openapi
 * /admin/accommodations/types/{id}:
 *   patch:
 *     summary: PATCH /admin/accommodations/types/{id}
 *     tags:
 *       - Admin Accommodations
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
adminRouter.patch("/types/:id", validateRequest(AccommodationValidation.updateAccommodationTypeSchema), AccommodationController.updateAccommodationType);
/**
 * @openapi
 * /admin/accommodations/types/{id}:
 *   delete:
 *     summary: DELETE /admin/accommodations/types/{id}
 *     tags:
 *       - Admin Accommodations
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
adminRouter.delete("/types/:id", validateRequest(AccommodationValidation.idParamsSchema), AccommodationController.deleteAccommodationType);
/**
 * @openapi
 * /admin/accommodations/units:
 *   post:
 *     summary: POST /admin/accommodations/units
 *     tags:
 *       - Admin Accommodations
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/units", validateRequest(AccommodationValidation.createAccommodationUnitSchema), AccommodationController.createAccommodationUnit);
/**
 * @openapi
 * /admin/accommodations/units/{id}:
 *   patch:
 *     summary: PATCH /admin/accommodations/units/{id}
 *     tags:
 *       - Admin Accommodations
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
adminRouter.patch("/units/:id", validateRequest(AccommodationValidation.updateAccommodationUnitSchema), AccommodationController.updateAccommodationUnit);
/**
 * @openapi
 * /admin/accommodations/units/{id}:
 *   delete:
 *     summary: DELETE /admin/accommodations/units/{id}
 *     tags:
 *       - Admin Accommodations
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
adminRouter.delete("/units/:id", validateRequest(AccommodationValidation.idParamsSchema), AccommodationController.deleteAccommodationUnit);

export const AccommodationRoutes = publicRouter;
export const AdminAccommodationRoutes = adminRouter;
