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
/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: POST /bookings
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: OK
 */
bookingRouter.post("/", validateRequest(BookingValidation.createBookingSchema), BookingController.createBooking);
/**
 * @openapi
 * /bookings/{id}/cancellation-requests:
 *   post:
 *     summary: POST /bookings/{id}/cancellation-requests
 *     tags:
 *       - Bookings
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
bookingRouter.post("/:id/cancellation-requests", validateRequest(BookingValidation.cancellationRequestSchema), BookingController.requestCancellation);
/**
 * @openapi
 * /bookings/{id}/rebooking-requests:
 *   post:
 *     summary: POST /bookings/{id}/rebooking-requests
 *     tags:
 *       - Bookings
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
bookingRouter.post("/:id/rebooking-requests", validateRequest(BookingValidation.rebookingRequestSchema), BookingController.requestRebooking);

customerBookingRouter.use(Auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /customer/bookings:
 *   get:
 *     summary: GET /customer/bookings
 *     tags:
 *       - Customer Bookings
 *     responses:
 *       200:
 *         description: OK
 */
customerBookingRouter.get("/", BookingController.getMyBookings);

adminBookingRouter.use(Auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN));
/**
 * @openapi
 * /admin/bookings:
 *   get:
 *     summary: GET /admin/bookings
 *     tags:
 *       - Admin Bookings
 *     responses:
 *       200:
 *         description: OK
 */
adminBookingRouter.get("/", BookingController.getAdminBookings);

export const BookingRoutes = bookingRouter;
export const CustomerBookingRoutes = customerBookingRouter;
export const AdminBookingRoutes = adminBookingRouter;
