export type SupportThreadStatus = "OPEN" | "CLOSED";
export type SupportMessageSender = "CUSTOMER" | "ADMIN" | "SYSTEM";

export type ISupportThread = {
    userId: string;
    bookingReference?: string;
    topic: string;
    status: SupportThreadStatus;
};

export type ISupportMessage = {
    threadId: string;
    senderRole: SupportMessageSender;
    text: string;
};
