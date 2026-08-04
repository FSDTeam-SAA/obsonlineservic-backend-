import { Schema, model } from "mongoose";
import { AccommodationCategory, CountryCode } from "../europarcs/europarcs.constant.js";
import type { IAccommodationType, IAccommodationUnit } from "./accommodation.interface.js";

const guestCapacitySchema = new Schema(
    {
        adults: { type: Number, min: 0, default: 0 },
        teenagers: { type: Number, min: 0, default: 0 },
        children: { type: Number, min: 0, default: 0 },
        infants: { type: Number, min: 0, default: 0 },
        pets: { type: Number, min: 0, default: 0 },
        maxOccupancy: { type: Number, min: 1, required: true },
    },
    { _id: false }
);

const roomSummarySchema = new Schema(
    {
        bedrooms: { type: Number, min: 0, default: 0 },
        bathrooms: { type: Number, min: 0, default: 0 },
        toilets: { type: Number, min: 0 },
    },
    { _id: false }
);

const featureSetSchema = new Schema(
    {
        hasWifi: { type: Boolean, default: true },
        hasKitchen: { type: Boolean, default: true },
        hasPrivateSanitary: { type: Boolean, default: false },
        hasWellness: { type: Boolean, default: false },
        isWheelchairAccessible: { type: Boolean, default: false },
        isPetFriendly: { type: Boolean, default: false },
        allowsPreferredHouseNumber: { type: Boolean, default: false },
    },
    { _id: false }
);

const imageSchema = new Schema(
    {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
    },
    { _id: false }
);

const accommodationTypeSchema = new Schema<IAccommodationType>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        category: { type: String, enum: Object.values(AccommodationCategory), required: true, index: true },
        shortDescription: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        defaultCapacity: { type: guestCapacitySchema, required: true },
        roomSummary: { type: roomSummarySchema, required: true },
        features: { type: featureSetSchema, required: true },
        images: { type: [imageSchema], default: [] },
        labels: { type: [String], default: [], index: true },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

accommodationTypeSchema.index({ name: "text", shortDescription: "text", description: "text" });

const accommodationUnitSchema = new Schema<IAccommodationUnit>(
    {
        name: { type: String, required: true, trim: true },
        unitCode: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        parkId: { type: String, required: true, index: true },
        parkSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
        accommodationTypeId: { type: String, required: true, index: true },
        accommodationTypeSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
        category: { type: String, enum: Object.values(AccommodationCategory), required: true, index: true },
        countryCode: { type: String, enum: Object.values(CountryCode), required: true, index: true },
        region: { type: String, required: true, trim: true, index: true },
        capacity: { type: guestCapacitySchema, required: true },
        roomSummary: { type: roomSummarySchema, required: true },
        features: { type: featureSetSchema, required: true },
        amenities: { type: [String], default: [] },
        images: { type: [imageSchema], default: [] },
        baseNightlyPrice: { type: Number, min: 0, required: true },
        currency: { type: String, default: "EUR", uppercase: true, trim: true },
        isActive: { type: Boolean, default: true, index: true },
        isPublished: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

accommodationUnitSchema.index({ parkSlug: 1, category: 1, isPublished: 1 });
accommodationUnitSchema.index({ "capacity.maxOccupancy": 1, "capacity.pets": 1 });
accommodationUnitSchema.index({ "features.isPetFriendly": 1, "features.isWheelchairAccessible": 1, "features.hasWellness": 1 });

export const AccommodationType = model<IAccommodationType>("AccommodationType", accommodationTypeSchema);
export const AccommodationUnit = model<IAccommodationUnit>("AccommodationUnit", accommodationUnitSchema);
