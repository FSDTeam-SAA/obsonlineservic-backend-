import { Schema, model } from "mongoose";
import { LanguageCode } from "../europarcs/europarcs.constant.js";
import type { IContactMessage, IContentPage, IFaqItem } from "./content.interface.js";

const contentSectionSchema = new Schema(
    {
        key: { type: String, required: true, trim: true },
        title: { type: String, trim: true },
        body: { type: String, trim: true },
        imageUrl: { type: String, trim: true },
        ctaLabel: { type: String, trim: true },
        ctaUrl: { type: String, trim: true },
    },
    { _id: false }
);

const contentPageSchema = new Schema<IContentPage>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true, trim: true, index: true },
        locale: { type: String, enum: Object.values(LanguageCode), required: true, index: true },
        pageType: {
            type: String,
            enum: ["HOME", "DESTINATION", "CAMPAIGN", "LEGAL", "GALLERY", "CONTACT", "FAQ"],
            required: true,
            index: true,
        },
        excerpt: { type: String, trim: true },
        sections: { type: [contentSectionSchema], default: [] },
        seoTitle: { type: String, trim: true },
        seoDescription: { type: String, trim: true },
        status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

contentPageSchema.index({ slug: 1, locale: 1 }, { unique: true });

const faqItemSchema = new Schema<IFaqItem>(
    {
        category: {
            type: String,
            enum: ["BOOKINGS", "ACCOMMODATIONS", "PAYMENTS", "CANCELLATIONS", "PARKS", "FACILITIES"],
            required: true,
            index: true,
        },
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
        locale: { type: String, enum: Object.values(LanguageCode), required: true, index: true },
        order: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

const contactMessageSchema = new Schema<IContactMessage>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true, index: true },
        phone: { type: String, trim: true },
        topic: {
            type: String,
            enum: ["BOOKING", "ACCOMMODATION", "PAYMENT", "PARK", "COMPLAINT", "GENERAL"],
            required: true,
            index: true,
        },
        message: { type: String, required: true, trim: true },
        status: { type: String, enum: ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"], default: "NEW", index: true },
    },
    { timestamps: true }
);

export const ContentPage = model<IContentPage>("ContentPage", contentPageSchema);
export const FaqItem = model<IFaqItem>("FaqItem", faqItemSchema);
export const ContactMessage = model<IContactMessage>("ContactMessage", contactMessageSchema);
