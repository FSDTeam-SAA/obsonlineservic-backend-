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

contentRouter.get("/", validateRequest(ContentValidation.listContentSchema), ContentController.listPublishedContent);
contentRouter.get("/:slug", validateRequest(ContentValidation.getBySlugSchema), ContentController.getPublishedContentBySlug);

faqRouter.get("/", validateRequest(ContentValidation.listFaqSchema), ContentController.listPublishedFaqs);

contactRouter.post("/", validateRequest(ContentValidation.createContactSchema), ContentController.createContactMessage);

adminContentRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
adminContentRouter.get("/pages", validateRequest(ContentValidation.listContentSchema), ContentController.listAdminContent);
adminContentRouter.post("/pages", validateRequest(ContentValidation.createContentPageSchema), ContentController.createContentPage);
adminContentRouter.patch("/pages/:id", validateRequest(ContentValidation.updateContentPageSchema), ContentController.updateContentPage);
adminContentRouter.delete("/pages/:id", validateRequest(ContentValidation.getByIdSchema), ContentController.deleteContentPage);
adminContentRouter.post("/faq", validateRequest(ContentValidation.createFaqSchema), ContentController.createFaq);
adminContentRouter.patch("/faq/:id", validateRequest(ContentValidation.updateFaqSchema), ContentController.updateFaq);
adminContentRouter.delete("/faq/:id", validateRequest(ContentValidation.getByIdSchema), ContentController.deleteFaq);
adminContentRouter.get(
    "/contact-messages",
    validateRequest(ContentValidation.listContactMessagesSchema),
    ContentController.listContactMessages
);
adminContentRouter.patch(
    "/contact-messages/:id",
    validateRequest(ContentValidation.updateContactStatusSchema),
    ContentController.updateContactStatus
);

export const ContentRoutes = contentRouter;
export const FaqRoutes = faqRouter;
export const ContactRoutes = contactRouter;
export const AdminContentRoutes = adminContentRouter;
