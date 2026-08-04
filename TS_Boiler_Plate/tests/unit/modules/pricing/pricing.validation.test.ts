import { describe, expect, it } from "vitest";
import { calculateNights } from "../../../../src/modules/pricing/pricing.service.js";
import { PricingValidation } from "../../../../src/modules/pricing/pricing.validation.js";

describe("PricingValidation", () => {
    it("accepts a seasonal rate plan payload", () => {
        const parsed = PricingValidation.createRatePlanSchema.parse({
            body: {
                name: "Standard 2026",
                slug: "standard-2026",
                accommodationUnitSlug: "comfort-holiday-home-6-demo-lake",
                seasonName: "Standard season",
                startDate: "2026-01-01",
                endDate: "2026-12-31",
                nightlyPrice: 129,
                minimumStayNights: 2,
                taxRate: 0.09,
                cleaningFee: 55,
                linenFee: 25,
                depositAmount: 150,
            },
        });

        expect(parsed.body.currency).toBe("EUR");
        expect(parsed.body.allowedArrivalDays).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it("accepts price quote payloads with extras and installments", () => {
        const parsed = PricingValidation.priceQuoteSchema.parse({
            body: {
                accommodationUnitSlug: "comfort-holiday-home-6-demo-lake",
                checkIn: "2026-06-01",
                checkOut: "2026-06-05",
                guests: {
                    adults: 2,
                    children: 2,
                    pets: 1,
                },
                extras: [
                    { slug: "comfort-package", quantity: 1 },
                    { slug: "towel-package", quantity: 4 },
                ],
                promoCode: "EARLY2026",
                paymentScheduleType: "INSTALLMENTS",
            },
        });

        expect(parsed.body.guests.teenagers).toBe(0);
        expect(parsed.body.extras).toHaveLength(2);
    });

    it("calculates stay nights deterministically", () => {
        expect(calculateNights("2026-06-01", "2026-06-05")).toBe(4);
    });

    it("rejects reversed quote dates", () => {
        expect(() => PricingValidation.priceQuoteSchema.parse({
            body: {
                accommodationUnitSlug: "comfort-holiday-home-6-demo-lake",
                checkIn: "2026-06-05",
                checkOut: "2026-06-01",
                guests: { adults: 2 },
            },
        })).toThrow();
    });
});
