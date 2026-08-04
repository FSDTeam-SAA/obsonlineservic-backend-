import { Router } from "express";
import { USER_ROLE } from "../../constant/role.constant.js";
import { Auth } from "../../middlewares/Auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { BookingController } from "./booking.controller.js";
import { BookingValidation } from "./booking.validation.js";

const bookingRouter = Router();
const customerBookingRouter = Router();
const adminBookingRouter = Router();

bookingRouter.use(Auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
bookingRouter.post("/", validateRequest(BookingValidation.createBookingSchema), BookingController.createBooking);
bookingRouter.post("/:id/cancellation-requests", validateRequest(BookingValidation.cancellationRequestSchema), BookingController.requestCancellation);
bookingRouter.post("/:id/rebooking-requests", validateRequest(BookingValidation.rebookingRequestSchema), BookingController.requestRebooking);

customerBookingRouter.use(Auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
customerBookingRouter.get("/", BookingController.getMyBookings);

adminBookingRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
adminBookingRouter.get("/", BookingController.getAdminBookings);

export const BookingRoutes = bookingRouter;
export const CustomerBookingRoutes = customerBookingRouter;
export const AdminBookingRoutes = adminBookingRouter;
