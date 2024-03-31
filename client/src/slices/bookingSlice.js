import { apiSlice } from "./apiSlice";
import { BOOKING_URL } from "../common/constants";

const bookingSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		bookClass: builder.mutation({
			query: (data) => ({
				url: `${BOOKING_URL}/${data.classId}`,
				method: "POST",
				body: data
			}),
		}),
	}),
});

export const { useBookClassMutation } = bookingSlice;

