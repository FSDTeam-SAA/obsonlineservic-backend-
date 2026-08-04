import { describe, expect, it } from "vitest";
import { EuroParcsRouteNamespace } from "../../../../src/modules/europarcs/europarcs.constant.js";
import { EuroParcsService } from "../../../../src/modules/europarcs/europarcs.service.js";

describe("EuroParcsService.getDomainContract", () => {
    it("defines the Phase 1 EuroParcs domain contracts", () => {
        const contract = EuroParcsService.getDomainContract();

        expect(contract.phase).toBe("PHASE_1_FOUNDATION_AND_DOMAIN_CONTRACTS");
        expect(contract.entities.map(entity => entity.key)).toEqual(
            expect.arrayContaining([
                "holidayPark",
                "accommodationType",
                "accommodationUnit",
                "availabilityCalendar",
                "ratePlan",
                "booking",
                "extra",
                "review",
                "contentPage",
                "contactMessage",
                "payment",
            ])
        );
    });

    it("publishes the route namespaces later phases will implement", () => {
        const contract = EuroParcsService.getDomainContract();
        const publicPaths = contract.routeNamespaces.flatMap(route => route.publicBasePath ? [route.publicBasePath] : []);

        expect(publicPaths).toEqual(
            expect.arrayContaining([
                EuroParcsRouteNamespace.PARKS,
                EuroParcsRouteNamespace.ACCOMMODATIONS,
                EuroParcsRouteNamespace.SEARCH,
                EuroParcsRouteNamespace.AVAILABILITY,
                EuroParcsRouteNamespace.BOOKINGS,
                EuroParcsRouteNamespace.EXTRAS,
                EuroParcsRouteNamespace.OFFERS,
                EuroParcsRouteNamespace.REVIEWS,
                EuroParcsRouteNamespace.CONTENT,
                EuroParcsRouteNamespace.FAQ,
                EuroParcsRouteNamespace.CONTACT,
                EuroParcsRouteNamespace.PAYMENTS,
            ])
        );
    });

    it("includes shared enums for search, pricing, booking, and localization", () => {
        const contract = EuroParcsService.getDomainContract();

        expect(contract.sharedEnums.accommodationCategories).toContain("HOLIDAY_HOME");
        expect(contract.sharedEnums.accommodationCategories).toContain("CAMPSITE");
        expect(contract.sharedEnums.bookingStatuses).toContain("CONFIRMED");
        expect(contract.sharedEnums.discountTypes).toContain("EARLY_BIRD");
        expect(contract.sharedEnums.guestAgeGroups).toEqual(["ADULT", "TEENAGER", "CHILD", "INFANT", "PET"]);
        expect(contract.sharedEnums.languageCodes).toEqual(expect.arrayContaining(["EN", "NL", "DE", "FR"]));
        expect(contract.sharedEnums.countryCodes).toEqual(expect.arrayContaining(["NL", "BE", "DE", "AT", "LU"]));
    });
});
