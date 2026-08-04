import { Schema, model } from "mongoose";
import { DiscountType } from "../europarcs/europarcs.constant.js";
import type { IExtra, IOffer, IRatePlan } from "./pricing.interface.js";

const ratePlanSchema = new Schema<IRatePlan>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        accommodationTypeSlug: { type: String, lowercase: true, trim: true, index: true },
        accommodationUnitSlug: { type: String, lowercase: true, trim: true, index: true },
        parkSlug: { type: String, lowercase: true, trim: true, index: true },
        seasonName: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true, index: true },
        nightlyPrice: { type: Number, min: 0, required: true },
        currency: { type: String, default: "EUR", uppercase: true, trim: true },
        minimumStayNights: { type: Number, min: 1, default: 1 },
        allowedArrivalDays: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
        allowedDepartureDays: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
        taxRate: { type: Number, min: 0, max: 1, default: 0 },
        cleaningFee: { type: Number, min: 0, default: 0 },
        linenFee: { type: Number, min: 0, default: 0 },
        depositAmount: { type: Number, min: 0, default: 0 },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

ratePlanSchema.index({ accommodationUnitSlug: 1, startDate: 1, endDate: 1, isActive: 1 });
ratePlanSchema.index({ accommodationTypeSlug: 1, parkSlug: 1, startDate: 1, endDate: 1, isActive: 1 });

const offerSchema = new Schema<IOffer>(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, uppercase: true, trim: true, sparse: true, index: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        discountType: { type: String, enum: Object.values(DiscountType), required: true, index: true },
        valueType: { type: String, enum: ["FIXED", "PERCENTAGE"], required: true },
        value: { type: Number, min: 0, required: true },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true, index: true },
        parkSlugs: { type: [String], default: [], index: true },
        accommodationTypeSlugs: { type: [String], default: [], index: true },
        accommodationUnitSlugs: { type: [String], default: [], index: true },
        minimumNights: { type: Number, min: 1 },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

const extraSchema = new Schema<IExtra>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, trim: true },
        priceMode: { type: String, enum: ["PER_STAY", "PER_NIGHT", "PER_GUEST", "PER_PET"], required: true },
        price: { type: Number, min: 0, required: true },
        currency: { type: String, default: "EUR", uppercase: true, trim: true },
        isMandatory: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

export const RatePlan = model<IRatePlan>("RatePlan", ratePlanSchema);
export const Offer = model<IOffer>("Offer", offerSchema);
export const Extra = model<IExtra>("Extra", extraSchema);
