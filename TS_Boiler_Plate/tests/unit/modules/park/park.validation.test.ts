import { describe, expect, it } from "vitest";
import { ParkValidation } from "../../../../src/modules/park/park.validation.js";

describe("ParkValidation", () => {
    it("accepts a EuroParcs-style holiday park payload", () => {
        const parsed = ParkValidation.createParkSchema.parse({
            body: {
                name: "EuroParcs Test Lake",
                slug: "europarcs-test-lake",
                countryCode: "NL",
                region: "Gelderland",
                location: {
                    city: "Otterlo",
                    region: "Gelderland",
                    countryCode: "NL",
                    latitude: 52.1,
                    longitude: 5.8,
                },
                shortDescription: "Family holiday park by the water.",
                description: "A family holiday park with water, nature, facilities, and bookable stays.",
            },
        });

        expect(parsed.body.isActive).toBe(true);
        expect(parsed.body.isPublished).toBe(false);
        expect(parsed.body.facilities).toEqual([]);
        expect(parsed.body.rating).toEqual({ average: 0, count: 0 });
    });

    it("rejects invalid slugs", () => {
        expect(() => ParkValidation.slugParamsSchema.parse({ params: { slug: "Bad Slug" } })).toThrow();
    });
});
