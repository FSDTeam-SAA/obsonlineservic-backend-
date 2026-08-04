import { Schema, model } from "mongoose";
import {
    CountryCode,
    FacilityType,
    LanguageCode,
} from "../europarcs/europarcs.constant.js";
import type { IDestinationTheme, IFacility, IHolidayPark } from "./park.interface.js";

const parkImageSchema = new Schema(
    {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
    },
    { _id: false }
);

const parkLocationSchema = new Schema(
    {
        address: { type: String },
        city: { type: String, required: true },
        region: { type: String, required: true },
        countryCode: { type: String, enum: Object.values(CountryCode), required: true },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    { _id: false }
);

const ratingSchema = new Schema(
    {
        average: { type: Number, min: 0, max: 10, default: 0 },
        count: { type: Number, min: 0, default: 0 },
    },
    { _id: false }
);

const holidayParkSchema = new Schema<IHolidayPark>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        countryCode: { type: String, enum: Object.values(CountryCode), required: true, index: true },
        region: { type: String, required: true, trim: true, index: true },
        location: { type: parkLocationSchema, required: true },
        shortDescription: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        facilities: { type: [String], default: [], index: true },
        amenities: { type: [String], default: [] },
        destinationThemes: { type: [String], default: [], index: true },
        images: { type: [parkImageSchema], default: [] },
        rating: { type: ratingSchema, default: () => ({ average: 0, count: 0 }) },
        isActive: { type: Boolean, default: true, index: true },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

holidayParkSchema.index({ name: "text", region: "text", shortDescription: "text" });
holidayParkSchema.index({ countryCode: 1, region: 1, isPublished: 1 });

const destinationThemeSchema = new Schema<IDestinationTheme>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, lowercase: true, trim: true, index: true },
        locale: { type: String, enum: Object.values(LanguageCode), required: true, index: true },
        category: { type: String, required: true, trim: true, index: true },
        description: { type: String, required: true, trim: true },
        image: { type: parkImageSchema },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

destinationThemeSchema.index({ slug: 1, locale: 1 }, { unique: true });

const facilitySchema = new Schema<IFacility>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        type: { type: String, enum: Object.values(FacilityType), required: true, index: true },
        icon: { type: String },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

export const HolidayPark = model<IHolidayPark>("HolidayPark", holidayParkSchema);
export const DestinationTheme = model<IDestinationTheme>("DestinationTheme", destinationThemeSchema);
export const Facility = model<IFacility>("Facility", facilitySchema);
