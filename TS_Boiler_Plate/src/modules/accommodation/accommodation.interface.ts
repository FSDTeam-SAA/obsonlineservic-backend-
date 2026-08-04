import type { AccommodationCategoryValue, CountryCodeValue } from "../europarcs/europarcs.interface.js";
import type { ParkImage } from "../park/park.interface.js";

export type GuestCapacity = {
    adults: number;
    teenagers: number;
    children: number;
    infants: number;
    pets: number;
    maxOccupancy: number;
};

export type AccommodationFeatureSet = {
    hasWifi: boolean;
    hasKitchen: boolean;
    hasPrivateSanitary: boolean;
    hasWellness: boolean;
    isWheelchairAccessible: boolean;
    isPetFriendly: boolean;
    allowsPreferredHouseNumber: boolean;
};

export type AccommodationRoomSummary = {
    bedrooms: number;
    bathrooms: number;
    toilets?: number;
};

export type IAccommodationType = {
    name: string;
    slug: string;
    category: AccommodationCategoryValue;
    shortDescription: string;
    description: string;
    defaultCapacity: GuestCapacity;
    roomSummary: AccommodationRoomSummary;
    features: AccommodationFeatureSet;
    images: ParkImage[];
    labels: string[];
    isPublished: boolean;
};

export type IAccommodationUnit = {
    name: string;
    unitCode: string;
    slug: string;
    parkId: string;
    parkSlug: string;
    accommodationTypeId: string;
    accommodationTypeSlug: string;
    category: AccommodationCategoryValue;
    countryCode: CountryCodeValue;
    region: string;
    capacity: GuestCapacity;
    roomSummary: AccommodationRoomSummary;
    features: AccommodationFeatureSet;
    amenities: string[];
    images: ParkImage[];
    baseNightlyPrice: number;
    currency: string;
    isActive: boolean;
    isPublished: boolean;
};

export type PublicAccommodationQuery = {
    parkSlug?: string;
    category?: AccommodationCategoryValue;
    countryCode?: CountryCodeValue;
    region?: string;
    guests?: string;
    pets?: string;
    isWheelchairAccessible?: string;
    isPetFriendly?: string;
    hasWellness?: string;
    hasPrivateSanitary?: string;
    page?: string;
    limit?: string;
};
