import { rateLimiter } from "@/middlewares/rateLimiter.js";
import validateRequest from "@/middlewares/validateRequest.js";
import { Router } from "express";
import { AuthValidation } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";
import { Auth } from "@/middlewares/Auth.js";


const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: POST /auth/login
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    "/login",
    rateLimiter.authRateLimiter,
    validateRequest(AuthValidation.loginSchema),
    AuthController.loginUser
);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: POST /auth/register
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    "/register",
    rateLimiter.authRateLimiter,
    validateRequest(AuthValidation.registerSchema),
    AuthController.registerUser
);

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: POST /auth/verify-email
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    "/verify-email",
    rateLimiter.authRateLimiter,
    validateRequest(AuthValidation.verifyEmailSchema),
    AuthController.verifyEmail
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: POST /auth/forgot-password
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    '/forgot-password',
    rateLimiter.authRateLimiter,
    validateRequest(AuthValidation.forgotPasswordSchema),
    AuthController.forgotPassword
);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: POST /auth/verify-otp
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    '/verify-otp',
    rateLimiter.sensitiveActionLimiter,
    validateRequest(AuthValidation.verifyOtpSchema),
    AuthController.verifyOtp
);


/**
 * @openapi
 * /auth/reset-password:
 *   patch:
 *     summary: PATCH /auth/reset-password
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.patch(
    '/reset-password',
    rateLimiter.sensitiveActionLimiter,
    validateRequest(AuthValidation.resetPasswordSchema),
    AuthController.resetPassword
);

// ── New Routes ───────────────────────────────────────────────────────

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     summary: POST /auth/refresh-token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    '/refresh-token',
    rateLimiter.authRateLimiter,
    validateRequest(AuthValidation.refreshTokenSchema),
    AuthController.refreshToken
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: POST /auth/logout
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    '/logout',
    Auth(),
    AuthController.logoutUser
);

/**
 * @openapi
 * /auth/resend-otp:
 *   post:
 *     summary: POST /auth/resend-otp
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
    '/resend-otp',
    rateLimiter.sensitiveActionLimiter,
    validateRequest(AuthValidation.resendOtpSchema),
    AuthController.resendOtp
);

export const AuthRoutes = router;