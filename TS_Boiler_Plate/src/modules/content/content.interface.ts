import type { LanguageCodeValue } from "../europarcs/europarcs.interface.js";

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ContentSection = {
    key: string;
    title?: string;
    body?: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
};

export type IContentPage = {
    title: string;
    slug: string;
    locale: LanguageCodeValue;
    pageType: "HOME" | "DESTINATION" | "CAMPAIGN" | "LEGAL" | "GALLERY" | "CONTACT" | "FAQ";
    excerpt?: string;
    sections: ContentSection[];
    seoTitle?: string;
    seoDescription?: string;
    status: ContentStatus;
    isPublished: boolean;
};

export type IFaqItem = {
    category: "BOOKINGS" | "ACCOMMODATIONS" | "PAYMENTS" | "CANCELLATIONS" | "PARKS" | "FACILITIES";
    question: string;
    answer: string;
    locale: LanguageCodeValue;
    order: number;
    isPublished: boolean;
};

export type IContactMessage = {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    topic: "BOOKING" | "ACCOMMODATION" | "PAYMENT" | "PARK" | "COMPLAINT" | "GENERAL";
    message: string;
    status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";
};
