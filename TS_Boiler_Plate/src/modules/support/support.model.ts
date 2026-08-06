import { Schema, model } from "mongoose";
import type { ISupportThread, ISupportMessage } from "./support.interface.js";

const supportThreadSchema = new Schema<ISupportThread>(
    {
        userId: { type: String, required: true, index: true },
        bookingReference: { type: String, index: true },
        topic: { type: String, required: true },
        status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN", index: true },
    },
    { timestamps: true }
);

const supportMessageSchema = new Schema<ISupportMessage>(
    {
        threadId: { type: String, required: true, index: true },
        senderRole: { type: String, enum: ["CUSTOMER", "ADMIN", "SYSTEM"], required: true },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

export const SupportThread = model<ISupportThread>("SupportThread", supportThreadSchema);
export const SupportMessage = model<ISupportMessage>("SupportMessage", supportMessageSchema);
