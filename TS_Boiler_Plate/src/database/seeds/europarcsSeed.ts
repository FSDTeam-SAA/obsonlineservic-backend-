import { logger } from "../../config/logger.js";
import { AccommodationType, AccommodationUnit } from "../../modules/accommodation/accommodation.model.js";
import { ContentPage, FaqItem } from "../../modules/content/content.model.js";
import { DestinationTheme, Facility, HolidayPark } from "../../modules/park/park.model.js";

export async function seedEuroParcsCatalog(): Promise<void> {
    await Facility.updateOne(
        { slug: "indoor-pool" },
        {
            $setOnInsert: {
                name: "Indoor pool",
                slug: "indoor-pool",
                type: "SPORTS_AND_PLAY",
                icon: "waves",
                isPublished: true,
            },
        },
        { upsert: true }
    );

    await Facility.updateOne(
        { slug: "restaurant" },
        {
            $setOnInsert: {
                name: "Restaurant",
                slug: "restaurant",
                type: "FOOD_AND_DRINK",
                icon: "utensils",
                isPublished: true,
            },
        },
        { upsert: true }
    );

    const destinationThemes = [
        {
            name: "Holiday by the sea",
            slug: "holiday-by-the-sea",
            category: "sea",
            description: "Discover holiday parks close to beaches, dunes, promenades, and coastal towns.",
        },
        {
            name: "Holiday by the water",
            slug: "holiday-by-the-water",
            category: "water",
            description: "Discover holiday parks close to lakes, beaches, marinas, and waterfront walks.",
        },
        {
            name: "Holiday in the mountains",
            slug: "holiday-in-the-mountains",
            category: "mountains",
            description: "Find stays near mountain views, hiking routes, fresh air, and outdoor adventure.",
        },
        {
            name: "Holiday in nature",
            slug: "holiday-in-nature",
            category: "nature",
            description: "Choose parks surrounded by forests, heathland, fields, and quiet walking routes.",
        },
        {
            name: "Beach holiday",
            slug: "beach-holiday",
            category: "beach",
            description: "Book beach-friendly stays for sunny days, sand, swimming, and family time.",
        },
        {
            name: "Wellness holiday",
            slug: "wellness-holiday",
            category: "wellness",
            description: "Relax in stays with wellness facilities, saunas, hot tubs, and peaceful surroundings.",
        },
        {
            name: "Family holiday",
            slug: "family-holiday",
            category: "family",
            description: "Find child-friendly parks with playgrounds, pools, activities, and family accommodation.",
        },
        {
            name: "Holiday with dog",
            slug: "holiday-with-dog",
            category: "pet-friendly",
            description: "Browse pet-friendly parks and accommodation for holidays with dogs.",
        },
        {
            name: "Group holiday",
            slug: "group-holiday",
            category: "group",
            description: "Discover larger accommodations for family weekends, friends, and group trips.",
        },
        {
            name: "Event holiday",
            slug: "event-holiday",
            category: "events",
            description: "Find parks near festivals, events, theme parks, and seasonal activities.",
        },
    ];

    for (const theme of destinationThemes) {
        await DestinationTheme.updateOne(
            { slug: theme.slug, locale: "EN" },
            {
                $setOnInsert: {
                    ...theme,
                    locale: "EN",
                    isPublished: true,
                },
            },
            { upsert: true }
        );
    }

    await HolidayPark.updateOne(
        { slug: "europarcs-demo-lake" },
        {
            $setOnInsert: {
                name: "EuroParcs Demo Lake",
                slug: "europarcs-demo-lake",
                countryCode: "NL",
                region: "Gelderland",
                location: {
                    city: "Otterlo",
                    region: "Gelderland",
                    countryCode: "NL",
                    latitude: 52.1001,
                    longitude: 5.7722,
                },
                shortDescription: "A family-friendly holiday park by the water.",
                description: "A launch demo park with water, nature, family facilities, and a EuroParcs-style booking catalog.",
                facilities: ["indoor-pool", "restaurant"],
                amenities: ["WiFi", "Playground", "Bike rental"],
                destinationThemes: ["holiday-by-the-water", "family-holiday"],
                images: [
                    {
                        url: "https://example.com/images/europarcs-demo-lake.jpg",
                        alt: "Holiday homes by a lake",
                        isPrimary: true,
                    },
                ],
                rating: { average: 8.4, count: 128 },
                isActive: true,
                isPublished: true,
            },
        },
        { upsert: true }
    );

    await ContentPage.updateOne(
        { slug: "homepage", locale: "EN" },
        {
            $setOnInsert: {
                title: "Find your holiday park",
                slug: "homepage",
                locale: "EN",
                pageType: "HOME",
                excerpt: "Search and book holiday parks, homes, camping, and offers.",
                sections: [
                    {
                        key: "hero",
                        title: "Book your perfect holiday park stay",
                        body: "Discover parks, accommodation, camping, destinations, and flexible booking options.",
                        ctaLabel: "Search & Book",
                        ctaUrl: "/book",
                    },
                ],
                seoTitle: "Holiday parks and homes",
                seoDescription: "Discover EuroParcs-style holiday parks and book your next stay.",
                status: "PUBLISHED",
                isPublished: true,
            },
        },
        { upsert: true }
    );

    await FaqItem.updateOne(
        { category: "BOOKINGS", locale: "EN", question: "Can I add extras to my booking?" },
        {
            $setOnInsert: {
                category: "BOOKINGS",
                locale: "EN",
                question: "Can I add extras to my booking?",
                answer: "Extras can be added during booking and later through the customer portal when eligible.",
                order: 1,
                isPublished: true,
            },
        },
        { upsert: true }
    );

    await AccommodationType.updateOne(
        { slug: "comfort-holiday-home" },
        {
            $setOnInsert: {
                name: "Comfort Holiday Home",
                slug: "comfort-holiday-home",
                category: "HOLIDAY_HOME",
                shortDescription: "A comfortable holiday home for families.",
                description: "A EuroParcs-style holiday home with bedrooms, kitchen, WiFi, and room for a family stay.",
                defaultCapacity: {
                    adults: 4,
                    teenagers: 0,
                    children: 2,
                    infants: 1,
                    pets: 1,
                    maxOccupancy: 6,
                },
                roomSummary: {
                    bedrooms: 3,
                    bathrooms: 1,
                    toilets: 1,
                },
                features: {
                    hasWifi: true,
                    hasKitchen: true,
                    hasPrivateSanitary: true,
                    hasWellness: false,
                    isWheelchairAccessible: false,
                    isPetFriendly: true,
                    allowsPreferredHouseNumber: true,
                },
                images: [
                    {
                        url: "https://example.com/images/comfort-holiday-home.jpg",
                        alt: "Comfort holiday home living room",
                        isPrimary: true,
                    },
                ],
                labels: ["family", "pet-friendly"],
                isPublished: true,
            },
        },
        { upsert: true }
    );

    await AccommodationType.updateOne(
        { slug: "comfort-campsite-pitch" },
        {
            $setOnInsert: {
                name: "Comfort Campsite Pitch",
                slug: "comfort-campsite-pitch",
                category: "CAMPSITE",
                shortDescription: "A spacious campsite pitch with private sanitary options.",
                description: "A bookable campsite pitch for guests who prefer camping inside a EuroParcs-style park.",
                defaultCapacity: {
                    adults: 2,
                    teenagers: 2,
                    children: 2,
                    infants: 1,
                    pets: 1,
                    maxOccupancy: 6,
                },
                roomSummary: {
                    bedrooms: 0,
                    bathrooms: 0,
                    toilets: 0,
                },
                features: {
                    hasWifi: true,
                    hasKitchen: false,
                    hasPrivateSanitary: false,
                    hasWellness: false,
                    isWheelchairAccessible: false,
                    isPetFriendly: true,
                    allowsPreferredHouseNumber: false,
                },
                images: [
                    {
                        url: "https://example.com/images/comfort-campsite-pitch.jpg",
                        alt: "Campsite pitch surrounded by trees",
                        isPrimary: true,
                    },
                ],
                labels: ["camping", "pet-friendly"],
                isPublished: true,
            },
        },
        { upsert: true }
    );

    const demoPark = await HolidayPark.findOne({ slug: "europarcs-demo-lake" }).lean();
    const holidayHomeType = await AccommodationType.findOne({ slug: "comfort-holiday-home" }).lean();
    const campsiteType = await AccommodationType.findOne({ slug: "comfort-campsite-pitch" }).lean();

    if (demoPark && holidayHomeType && campsiteType) {
        await AccommodationUnit.updateOne(
            { unitCode: "EDL-HH-001" },
            {
                $setOnInsert: {
                    name: "Comfort Holiday Home 6",
                    unitCode: "EDL-HH-001",
                    slug: "comfort-holiday-home-6-demo-lake",
                    parkId: String(demoPark._id),
                    parkSlug: "europarcs-demo-lake",
                    accommodationTypeId: String(holidayHomeType._id),
                    accommodationTypeSlug: "comfort-holiday-home",
                    category: "HOLIDAY_HOME",
                    countryCode: "NL",
                    region: "Gelderland",
                    capacity: {
                        adults: 4,
                        teenagers: 0,
                        children: 2,
                        infants: 1,
                        pets: 1,
                        maxOccupancy: 6,
                    },
                    roomSummary: {
                        bedrooms: 3,
                        bathrooms: 1,
                        toilets: 1,
                    },
                    features: {
                        hasWifi: true,
                        hasKitchen: true,
                        hasPrivateSanitary: true,
                        hasWellness: false,
                        isWheelchairAccessible: false,
                        isPetFriendly: true,
                        allowsPreferredHouseNumber: true,
                    },
                    amenities: ["WiFi", "Kitchen", "Terrace", "Parking"],
                    images: [
                        {
                            url: "https://example.com/images/comfort-holiday-home-6.jpg",
                            alt: "Comfort holiday home exterior",
                            isPrimary: true,
                        },
                    ],
                    baseNightlyPrice: 129,
                    currency: "EUR",
                    isActive: true,
                    isPublished: true,
                },
            },
            { upsert: true }
        );

        await AccommodationUnit.updateOne(
            { unitCode: "EDL-CP-001" },
            {
                $setOnInsert: {
                    name: "Comfort Campsite Pitch",
                    unitCode: "EDL-CP-001",
                    slug: "comfort-campsite-pitch-demo-lake",
                    parkId: String(demoPark._id),
                    parkSlug: "europarcs-demo-lake",
                    accommodationTypeId: String(campsiteType._id),
                    accommodationTypeSlug: "comfort-campsite-pitch",
                    category: "CAMPSITE",
                    countryCode: "NL",
                    region: "Gelderland",
                    capacity: {
                        adults: 2,
                        teenagers: 2,
                        children: 2,
                        infants: 1,
                        pets: 1,
                        maxOccupancy: 6,
                    },
                    roomSummary: {
                        bedrooms: 0,
                        bathrooms: 0,
                        toilets: 0,
                    },
                    features: {
                        hasWifi: true,
                        hasKitchen: false,
                        hasPrivateSanitary: false,
                        hasWellness: false,
                        isWheelchairAccessible: false,
                        isPetFriendly: true,
                        allowsPreferredHouseNumber: false,
                    },
                    amenities: ["Electricity", "Water point", "WiFi"],
                    images: [
                        {
                            url: "https://example.com/images/comfort-campsite-pitch-demo-lake.jpg",
                            alt: "Comfort campsite pitch at Demo Lake",
                            isPrimary: true,
                        },
                    ],
                    baseNightlyPrice: 39,
                    currency: "EUR",
                    isActive: true,
                    isPublished: true,
                },
            },
            { upsert: true }
        );
    }

    logger.info("Seeded EuroParcs catalog, content, and FAQ data.");
}
