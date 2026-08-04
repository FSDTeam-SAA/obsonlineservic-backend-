export type AvailabilityBlockType = "BOOKING" | "HOLD" | "MAINTENANCE" | "OWNER_USE";

export type IAvailabilityBlock = {
    accommodationUnitId: string;
    accommodationUnitSlug: string;
    parkSlug: string;
    startDate: Date;
    endDate: Date;
    type: AvailabilityBlockType;
    reason?: string;
    isActive: boolean;
};

export type AvailabilityQuery = {
    accommodationUnitSlug?: string;
    parkSlug?: string;
    startDate?: string;
    endDate?: string;
    type?: AvailabilityBlockType;
    page?: string;
    limit?: string;
};
