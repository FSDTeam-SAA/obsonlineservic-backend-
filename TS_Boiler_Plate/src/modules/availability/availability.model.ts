import { Schema, model } from "mongoose";
import type { IAvailabilityBlock } from "./availability.interface.js";

const availabilityBlockSchema = new Schema<IAvailabilityBlock>(
    {
        accommodationUnitId: { type: String, required: true, index: true },
        accommodationUnitSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
        parkSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true, index: true },
        type: { type: String, enum: ["BOOKING", "HOLD", "MAINTENANCE", "OWNER_USE"], required: true, index: true },
        reason: { type: String, trim: true },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

availabilityBlockSchema.index({ accommodationUnitSlug: 1, startDate: 1, endDate: 1, isActive: 1 });
availabilityBlockSchema.index({ parkSlug: 1, startDate: 1, endDate: 1, isActive: 1 });

export const AvailabilityBlock = model<IAvailabilityBlock>("AvailabilityBlock", availabilityBlockSchema);
