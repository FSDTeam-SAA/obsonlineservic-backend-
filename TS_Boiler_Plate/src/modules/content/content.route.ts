import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { ContentController } from "./content.controller.js";
import { ContentValidation } from "./content.validation.js";

const contentRouter = Router();
const faqRouter = Router();
const contactRouter = Router();
const adminContentRouter = Router();

/**
 * @openapi
 * /content:
 *   get:
 *     summary: GET /content
 *     tags:
 *       - Content
 *     responses:
 *       200:
 *         description: OK
 */
contentRouter.get("/", validateRequest(ContentValidation.listContentSchema), ContentController.listPublishedContent);
/**
 * @openapi
 * /content/{slug}:
 *   get:
 *     summary: GET /content/{slug}
 *     tags:
 *       - Content
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
contentRouter.get("/:slug", validateRequest(ContentValidation.getBySlugSchema), ContentController.getPublishedContentBySlug);

/**
 * @openapi
 * /faq:
 *   get:
 *     summary: GET /faq
 *     tags:
 *       - FAQ
 *     responses:
 *       200:
 *         description: OK
 */
faqRouter.get("/", validateRequest(ContentValidation.listFaqSchema), ContentController.listPublishedFaqs);

/**
 * @openapi
 * /contact:
 *   post:
 *     summary: POST /contact
 *     tags:
 *       - Contact
 *     responses:
 *       200:
 *         description: OK
 */
contactRouter.post("/", validateRequest(ContentValidation.createContactSchema), ContentController.createContactMessage);

adminContentRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /admin/content/pages:
 *   get:
 *     summary: GET /admin/content/pages
 *     tags:
 *       - Admin Content
 *     responses:
 *       200:
 *         description: OK
 */
adminContentRouter.get("/pages", validateRequest(ContentValidation.listContentSchema), ContentController.listAdminContent);
/**
 * @openapi
 * /admin/content/pages:
 *   post:
 *     summary: POST /admin/content/pages
 *     tags:
 *       - Admin Content
 *     responses:
 *       200:
 *         description: OK
 */
adminContentRouter.post("/pages", validateRequest(ContentValidation.createContentPageSchema), ContentController.createContentPage);
/**
 * @openapi
 * /admin/content/pages/{id}:
 *   patch:
 *     summary: PATCH /admin/content/pages/{id}
 *     tags:
 *       - Admin Content
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
adminContentRouter.patch("/pages/:id", validateRequest(ContentValidation.updateContentPageSchema), ContentController.updateContentPage);
/**
 * @openapi
 * /admin/content/pages/{id}:
 *   delete:
 *     summary: DELETE /admin/content/pages/{id}
 *     tags:
 *       - Admin Content
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
adminContentRouter.delete("/pages/:id", validateRequest(ContentValidation.getByIdSchema), ContentController.deleteContentPage);
/**
 * @openapi
 * /admin/content/faq:
 *   post:
 *     summary: POST /admin/content/faq
 *     tags:
 *       - Admin Content
 *     responses:
 *       200:
 *         description: OK
 */
adminContentRouter.post("/faq", validateRequest(ContentValidation.createFaqSchema), ContentController.createFaq);
/**
 * @openapi
 * /admin/content/faq/{id}:
 *   patch:
 *     summary: PATCH /admin/content/faq/{id}
 *     tags:
 *       - Admin Content
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
adminContentRouter.patch("/faq/:id", validateRequest(ContentValidation.updateFaqSchema), ContentController.updateFaq);
/**
 * @openapi
 * /admin/content/faq/{id}:
 *   delete:
 *     summary: DELETE /admin/content/faq/{id}
 *     tags:
 *       - Admin Content
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
adminContentRouter.delete("/faq/:id", validateRequest(ContentValidation.getByIdSchema), ContentController.deleteFaq);
/**
 * @openapi
 * /admin/content/contact-messages:
 *   get:
 *     summary: GET /admin/content/contact-messages
 *     tags:
 *       - Admin Content
 *     responses:
 *       200:
 *         description: OK
 */
adminContentRouter.get(
    "/contact-messages",
    validateRequest(ContentValidation.listContactMessagesSchema),
    ContentController.listContactMessages
);
/**
 * @openapi
 * /admin/content/contact-messages/{id}:
 *   patch:
 *     summary: PATCH /admin/content/contact-messages/{id}
 *     tags:
 *       - Admin Content
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
adminContentRouter.patch(
    "/contact-messages/:id",
    validateRequest(ContentValidation.updateContactStatusSchema),
    ContentController.updateContactStatus
);

export const ContentRoutes = contentRouter;
export const FaqRoutes = faqRouter;
export const ContactRoutes = contactRouter;
export const AdminContentRoutes = adminContentRouter;
