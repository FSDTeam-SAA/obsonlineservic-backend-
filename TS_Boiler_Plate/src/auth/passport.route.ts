import { Router } from "express";
import passport from "passport";
import { StatusCodes } from "http-status-codes";
import { createToken } from "../utils/jwt.js";
import config from "../config/index.js";
import { sendResponse } from "../utils/sendResponse.js";
import { getAuthTokenMeta } from "../utils/tokenMeta.js";
import ms from "ms";
import type { IUser } from "../modules/user/user.interface.js";

const router = Router();

/**
 * Helper: generate tokens + set cookie for OAuth callback responses.
 */
function handleOAuthSuccess(req: Express.Request, res: import("express").Response): void {
    const user = req.user as IUser & { _id: string };

    const jwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(jwtPayload, config.jwt.jwtAccessSecret, config.jwt.jwtExpiresIn);
    const refreshToken = createToken(jwtPayload, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);

    // Set refresh token cookie
    const refreshMaxAge = ms(config.jwt.refreshExpiresIn as ms.StringValue);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === "production",
        sameSite: config.nodeEnv === "production" ? "strict" : "lax",
        maxAge: typeof refreshMaxAge === "number" ? refreshMaxAge : 30 * 24 * 60 * 60 * 1000,
        path: "/",
    });

    const meta = getAuthTokenMeta();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "OAuth login successful",
        data: {
            accessToken,
            refreshToken,
            ...meta,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        },
    });
}

// ── Google OAuth ─────────────────────────────────────────────────────

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: GET /auth/google
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: GET /auth/google/callback
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/login" }),
    (req, res) => handleOAuthSuccess(req, res)
);

// ── GitHub OAuth ─────────────────────────────────────────────────────

/**
 * @openapi
 * /auth/github:
 *   get:
 *     summary: GET /auth/github
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"], session: false })
);

/**
 * @openapi
 * /auth/github/callback:
 *   get:
 *     summary: GET /auth/github/callback
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
    "/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/api/v1/auth/login" }),
    (req, res) => handleOAuthSuccess(req, res)
);

export const passportRouter = router;
