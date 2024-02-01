import { SCHEDULE_URL } from "../common/constants";
import { apiSlice } from "./apiSlice";

export const scheduleApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getClasses: builder.query({
			query: () => ({
				url: SCHEDULE_URL,
				// params: {
				// 	date,
				// 	classType
				// },
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
		updateClassById: builder.mutation({
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

export const {useGetClassesQuery, useGetClassByIdQuery, useCreateClassMutation, useUpdateClassByIdMutation} = scheduleApiSlice;
