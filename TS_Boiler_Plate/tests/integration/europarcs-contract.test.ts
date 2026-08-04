import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";

let app: Express;

describe("EuroParcs domain contract endpoint", () => {
    beforeAll(async () => {
        process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-jwt-secret";
        process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";
        process.env.JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET ?? "test-refresh-secret";
        process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
        process.env.DB_TYPE = process.env.DB_TYPE ?? "mongodb";
        process.env.MONGODB_URL = process.env.MONGODB_URL ?? "mongodb://localhost:27017/test-ci";

        const { createApp } = await import("../../src/app.js");
        app = createApp();
    });

    it("returns the Phase 1 contract", async () => {
        const response = await request(app).get("/api/v1/europarcs/domain-contract");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                message: "EuroParcs domain contract retrieved successfully",
                statusCode: 200,
            })
        );
        expect(response.body.data).toEqual(
            expect.objectContaining({
                product: "EuroParcs-like holiday park booking platform",
                phase: "PHASE_1_FOUNDATION_AND_DOMAIN_CONTRACTS",
            })
        );
        expect(response.body.data.routeNamespaces).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    module: "parks",
                    publicBasePath: "/api/v1/parks",
                }),
                expect.objectContaining({
                    module: "bookings",
                    publicBasePath: "/api/v1/bookings",
                    customerBasePath: "/api/v1/customer/bookings",
                    adminBasePath: "/api/v1/admin/bookings",
                }),
            ])
        );
    });
});
