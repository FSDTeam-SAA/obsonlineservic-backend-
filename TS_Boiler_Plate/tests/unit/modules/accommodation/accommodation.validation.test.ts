import { describe, expect, it } from "vitest";
import { AccommodationValidation } from "../../../../src/modules/accommodation/accommodation.validation.js";

const capacity = {
    adults: 4,
    teenagers: 0,
    children: 2,
    infants: 1,
    pets: 1,
    maxOccupancy: 6,
};

const roomSummary = {
    bedrooms: 3,
    bathrooms: 1,
    toilets: 1,
};

const features = {
    hasWifi: true,
    hasKitchen: true,
    hasPrivateSanitary: true,
    hasWellness: false,
    isWheelchairAccessible: false,
    isPetFriendly: true,
    allowsPreferredHouseNumber: true,
};

describe("AccommodationValidation", () => {
    it("accepts a EuroParcs-style accommodation type payload", () => {
        const parsed = AccommodationValidation.createAccommodationTypeSchema.parse({
            body: {
                name: "Comfort Holiday Home",
                slug: "comfort-holiday-home",
                category: "HOLIDAY_HOME",
                shortDescription: "A comfortable family holiday home.",
                description: "A comfortable family holiday home with a full kitchen, WiFi, private sanitary, and outdoor seating.",
                defaultCapacity: capacity,
                roomSummary,
                features,
            },
        });

        expect(parsed.body.images).toEqual([]);
        expect(parsed.body.labels).toEqual([]);
        expect(parsed.body.isPublished).toBe(false);
    });

    it("accepts a campsite unit payload", () => {
        const parsed = AccommodationValidation.createAccommodationUnitSchema.parse({
            body: {
                name: "Comfort Campsite Pitch",
                unitCode: "EDL-CP-001",
                slug: "comfort-campsite-pitch-demo-lake",
                parkId: "park_123",
                parkSlug: "europarcs-demo-lake",
                accommodationTypeId: "type_123",
                accommodationTypeSlug: "comfort-campsite-pitch",
                category: "CAMPSITE",
                countryCode: "NL",
                region: "Gelderland",
                capacity,
                roomSummary: {
                    bedrooms: 0,
                    bathrooms: 0,
                    toilets: 0,
                },
                features: {
                    ...features,
                    hasKitchen: false,
                    hasPrivateSanitary: false,
                },
                baseNightlyPrice: 39,
            },
        });

        expect(parsed.body.currency).toBe("EUR");
        expect(parsed.body.isActive).toBe(true);
        expect(parsed.body.isPublished).toBe(false);
    });

    it("supports public filters for capacity, pets, accessibility, and wellness", () => {
        const parsed = AccommodationValidation.listAccommodationSchema.parse({
            query: {
                parkSlug: "europarcs-demo-lake",
                category: "HOLIDAY_HOME",
                guests: "6",
                pets: "1",
                isPetFriendly: "true",
                isWheelchairAccessible: "true",
                hasWellness: "true",
            },
        });

        expect(parsed.query.parkSlug).toBe("europarcs-demo-lake");
        expect(parsed.query.guests).toBe("6");
    });
});
