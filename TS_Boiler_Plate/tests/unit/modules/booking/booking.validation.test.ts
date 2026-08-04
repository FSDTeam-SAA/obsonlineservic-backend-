import { describe, expect, it } from "vitest";
import { BookingValidation } from "../../../../src/modules/booking/booking.validation.js";

const customer = {
    firstName: "Ava",
    lastName: "Jansen",
    email: "ava@example.com",
    phone: "+31612345678",
    countryCode: "NL",
};

describe("BookingValidation", () => {
    it("accepts booking creation payloads with customer, guests, extras, and payment schedule", () => {
        const parsed = BookingValidation.createBookingSchema.parse({
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
                    { slug: "flexibility-guarantee", quantity: 1 },
                ],
                promoCode: "EARLY2026",
                paymentScheduleType: "INSTALLMENTS",
                customer,
            },
        });

        expect(parsed.body.guests.teenagers).toBe(0);
        expect(parsed.body.customer.email).toBe("ava@example.com");
        expect(parsed.body.extras).toHaveLength(2);
    });

    it("rejects reversed booking dates", () => {
        expect(() => BookingValidation.createBookingSchema.parse({
            body: {
                accommodationUnitSlug: "comfort-holiday-home-6-demo-lake",
                checkIn: "2026-06-05",
                checkOut: "2026-06-01",
                guests: { adults: 2 },
                customer,
            },
        })).toThrow();
    });

    it("accepts cancellation and rebooking requests", () => {
        const cancellation = BookingValidation.cancellationRequestSchema.parse({
            params: { id: "booking_123" },
            body: { reason: "My travel dates changed and I need to cancel." },
        });
        const rebooking = BookingValidation.rebookingRequestSchema.parse({
            params: { id: "booking_123" },
            body: {
                requestedCheckIn: "2026-06-10",
                requestedCheckOut: "2026-06-14",
                requestedAccommodationUnitSlug: "comfort-campsite-pitch-demo-lake",
            },
        });

        expect(cancellation.body.reason).toContain("cancel");
        expect(rebooking.body.requestedAccommodationUnitSlug).toBe("comfort-campsite-pitch-demo-lake");
    });
});
