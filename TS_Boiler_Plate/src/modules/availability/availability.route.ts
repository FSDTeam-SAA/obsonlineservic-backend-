import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AvailabilityController } from "./availability.controller.js";
import { AvailabilityValidation } from "./availability.validation.js";

const adminRouter = Router();

adminRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /admin/availability:
 *   get:
 *     summary: GET /admin/availability
 *     tags:
 *       - Admin Availability
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.get("/", validateRequest(AvailabilityValidation.listAvailabilitySchema), AvailabilityController.listAvailabilityBlocks);
/**
 * @openapi
 * /admin/availability:
 *   post:
 *     summary: POST /admin/availability
 *     tags:
 *       - Admin Availability
 *     responses:
 *       200:
 *         description: OK
 */
adminRouter.post("/", validateRequest(AvailabilityValidation.createAvailabilityBlockSchema), AvailabilityController.createAvailabilityBlock);
/**
 * @openapi
 * /admin/availability/{id}:
 *   patch:
 *     summary: PATCH /admin/availability/{id}
 *     tags:
 *       - Admin Availability
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
adminRouter.patch("/:id", validateRequest(AvailabilityValidation.updateAvailabilityBlockSchema), AvailabilityController.updateAvailabilityBlock);
/**
 * @openapi
 * /admin/availability/{id}:
 *   delete:
 *     summary: DELETE /admin/availability/{id}
 *     tags:
 *       - Admin Availability
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
adminRouter.delete("/:id", validateRequest(AvailabilityValidation.idParamsSchema), AvailabilityController.deleteAvailabilityBlock);

export const AdminAvailabilityRoutes = adminRouter;
