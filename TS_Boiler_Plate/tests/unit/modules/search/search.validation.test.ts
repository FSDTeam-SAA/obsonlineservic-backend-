import { describe, expect, it } from "vitest";
import { SearchValidation } from "../../../../src/modules/search/search.validation.js";
import { buildSearchUnitQuery } from "../../../../src/modules/search/search.service.js";

describe("SearchValidation", () => {
    it("accepts a EuroParcs-style search query", () => {
        const parsed = SearchValidation.searchSchema.parse({
            query: {
                countryCode: "NL",
                parkSlug: "europarcs-demo-lake",
                category: "HOLIDAY_HOME",
                checkIn: "2026-12-20",
                checkOut: "2026-12-24",
                adults: "2",
                children: "2",
                pets: "1",
                facilities: "indoor-pool,restaurant",
                themes: "family-holiday",
                minPrice: "50",
                maxPrice: "250",
                sortBy: "baseNightlyPrice",
                sortOrder: "asc",
            },
        });

        expect(parsed.query.parkSlug).toBe("europarcs-demo-lake");
        expect(parsed.query.checkOut).toBe("2026-12-24");
    });

    it("rejects partial date ranges", () => {
        expect(() => SearchValidation.searchSchema.parse({
            query: {
                checkIn: "2026-12-20",
            },
        })).toThrow();
    });

    it("builds capacity, pet, price, date exclusion, and park content filters", () => {
        const query = buildSearchUnitQuery(
            {
                countryCode: "NL",
                adults: "2",
                children: "2",
                pets: "1",
                minPrice: "50",
                maxPrice: "250",
                hasWellness: "true",
            },
            ["unit_123"],
            ["europarcs-demo-lake"]
        );

        expect(query).toEqual(expect.objectContaining({
            countryCode: "NL",
            isActive: true,
            isPublished: true,
            _id: { $nin: ["unit_123"] },
            parkSlug: { $in: ["europarcs-demo-lake"] },
            "capacity.maxOccupancy": { $gte: 4 },
            "capacity.pets": { $gte: 1 },
            "features.isPetFriendly": true,
            "features.hasWellness": true,
            baseNightlyPrice: { $gte: 50, $lte: 250 },
        }));
    });
});
