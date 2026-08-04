import type { AccommodationCategoryValue, CountryCodeValue } from "../europarcs/europarcs.interface.js";

export type SearchQuery = {
    searchTerm?: string;
    countryCode?: CountryCodeValue;
    parkSlug?: string;
    region?: string;
    category?: AccommodationCategoryValue;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    teenagers?: string;
    children?: string;
    infants?: string;
    pets?: string;
    facilities?: string;
    themes?: string;
    minPrice?: string;
    maxPrice?: string;
    isWheelchairAccessible?: string;
    isPetFriendly?: string;
    hasWellness?: string;
    hasPrivateSanitary?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: string;
    limit?: string;
};

export type SearchMapMarker = {
    parkSlug: string;
    parkName: string;
    latitude: number;
    longitude: number;
    resultCount: number;
};

export type SearchFilterCounts = {
    categories: Record<string, number>;
    countries: Record<string, number>;
    regions: Record<string, number>;
    parks: Record<string, number>;
    features: {
        isPetFriendly: number;
        isWheelchairAccessible: number;
        hasWellness: number;
        hasPrivateSanitary: number;
    };
};
