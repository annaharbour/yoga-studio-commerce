import { SCHEDULE_URL } from "../constants";
import { apiSlice } from "./apiSlice";
export const scheduleApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getClasses: builder.query({
			query: ({ keyword }) => ({
				url: SCHEDULE_URL,
				params: {
					keyword,
				},
			}),
			keepUnusedDataFor: 5,
			providesTags: ["YogaClasses"],
		}),
		getClassById: builder.query({
			query: (classId) => ({
				url: `${SCHEDULE_URL}/${classId}`,
			}),
			keepUnusedDataFor: 5,
		}),
		createClass: builder.mutation({
			query: () => ({
				url: SCHEDULE_URL,
				method: "POST",
			}),
			invalidatesTags: ["YogaClass"],
		}),
		updateProduct: builder.mutation({
			query: (data) => ({
				url: `${SCHEDULE_URL}/${data.classId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["YogaClasses"],
		}),
		cancelClass: builder.mutation({
			query: (classId) => ({
				url: `${SCHEDULE_URL}/${classId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {getClasses, getClassById, createClass, updateProduct} = scheduleApiSlice;
