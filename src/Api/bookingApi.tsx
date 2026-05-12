import { POST_API } from "./apiRequest";

export const updateBookingStatus = async (bookingId: string, status: string, token: string) => {
    // Correct endpoint: providers/bookingById/:id/status using PATCH
    return await POST_API(token, { status }, `providers/bookingById/${bookingId}/status`, () => {}, "PATCH");
};
