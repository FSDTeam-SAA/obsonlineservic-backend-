import { describe, expect, it } from "vitest";
import { AvailabilityValidation } from "../../../../src/modules/availability/availability.validation.js";
import { buildAvailabilityOverlapQuery } from "../../../../src/modules/availability/availability.service.js";

describe("AvailabilityValidation", () => {
    it("accepts an unavailable date block", () => {
        const parsed = AvailabilityValidation.createAvailabilityBlockSchema.parse({
            body: {
                accommodationUnitId: "unit_123",
                accommodationUnitSlug: "comfort-holiday-home-6-demo-lake",
                parkSlug: "europarcs-demo-lake",
                startDate: "2026-12-24",
                endDate: "2026-12-28",
                type: "MAINTENANCE",
            },
        });

        expect(parsed.body.isActive).toBe(true);
    });

    it("rejects reversed date ranges", () => {
        expect(() => AvailabilityValidation.createAvailabilityBlockSchema.parse({
            body: {
                accommodationUnitId: "unit_123",
                accommodationUnitSlug: "comfort-holiday-home-6-demo-lake",
                parkSlug: "europarcs-demo-lake",
                startDate: "2026-12-28",
                endDate: "2026-12-24",
                type: "MAINTENANCE",
            },
        })).toThrow();
    });

    it("builds an overlapping date query", () => {
        const query = buildAvailabilityOverlapQuery("2026-12-24", "2026-12-28");

        expect(query).toEqual({
            isActive: true,
            startDate: { $lt: new Date("2026-12-28T00:00:00.000Z") },
            endDate: { $gt: new Date("2026-12-24T00:00:00.000Z") },
        });
    });
});
