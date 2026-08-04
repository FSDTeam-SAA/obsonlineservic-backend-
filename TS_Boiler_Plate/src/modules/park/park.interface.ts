import type { CountryCodeValue, FacilityTypeValue, LanguageCodeValue } from "../europarcs/europarcs.interface.js";

export type ParkImage = {
    url: string;
    alt: string;
    isPrimary: boolean;
};

export type ParkLocation = {
    address?: string;
    city: string;
    region: string;
    countryCode: CountryCodeValue;
    latitude?: number;
    longitude?: number;
};

export type ParkRatingSummary = {
    average: number;
    count: number;
};

export type IHolidayPark = {
    name: string;
    slug: string;
    countryCode: CountryCodeValue;
    region: string;
    location: ParkLocation;
    shortDescription: string;
    description: string;
    facilities: string[];
    amenities: string[];
    destinationThemes: string[];
    images: ParkImage[];
    rating: ParkRatingSummary;
    isActive: boolean;
    isPublished: boolean;
};

export type IDestinationTheme = {
    name: string;
    slug: string;
    locale: LanguageCodeValue;
    category: string;
    description: string;
    image?: ParkImage;
    isPublished: boolean;
};

export type IFacility = {
    name: string;
    slug: string;
    type: FacilityTypeValue;
    icon?: string;
    isPublished: boolean;
};

export type PublicParkQuery = {
    countryCode?: CountryCodeValue;
    region?: string;
    theme?: string;
    facility?: string;
    searchTerm?: string;
    page?: string;
    limit?: string;
};
