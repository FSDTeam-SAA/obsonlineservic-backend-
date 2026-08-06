import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { SupportController } from "./support.controller.js";
import { SupportValidation } from "./support.validation.js";

const supportRouter = Router();

supportRouter.use(Auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));

/**
 * @openapi
 * /customer/support/threads:
 *   post:
 *     summary: POST /customer/support/threads
 *     tags:
 *       - Customer Support
 *     responses:
 *       200:
 *         description: OK
 */
supportRouter.post("/threads", validateRequest(SupportValidation.createThreadSchema), SupportController.createThread);

/**
 * @openapi
 * /customer/support/threads:
 *   get:
 *     summary: GET /customer/support/threads
 *     tags:
 *       - Customer Support
 *     responses:
 *       200:
 *         description: OK
 */
supportRouter.get("/threads", SupportController.getMyThreads);

/**
 * @openapi
 * /customer/support/threads/{id}/messages:
 *   get:
 *     summary: GET /customer/support/threads/{id}/messages
 *     tags:
 *       - Customer Support
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
supportRouter.get("/threads/:id/messages", validateRequest(SupportValidation.idParamsSchema), SupportController.getThreadMessages);

/**
 * @openapi
 * /customer/support/threads/{id}/messages:
 *   post:
 *     summary: POST /customer/support/threads/{id}/messages
 *     tags:
 *       - Customer Support
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
supportRouter.post("/threads/:id/messages", validateRequest(SupportValidation.createMessageSchema), SupportController.addMessageToThread);

export const SupportRoutes = supportRouter;
