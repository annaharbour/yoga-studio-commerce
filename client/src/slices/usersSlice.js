import { USERS_URL } from "../common/constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/login`,
				method: "POST",
				body: data,
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/register`,
				method: "POST",
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: "POST",
			}),
		}),
		getUsers: builder.query({
			query: () => ({
				url: `${USERS_URL}/users`,
			}),
			providesTags: ["User"],
			keepUnusedDataFor: 5,
		}),
		deleteUser: builder.mutation({
			query: (userId) => ({
				url: `${USERS_URL}/${userId}`,
				method: "DELETE",
			}),
		}),
		getUserDetails: builder.query({
			query: (userId) => ({
				url: `${USERS_URL}/${userId}`,
			}),
			keepUnusedDataFor: 5,
		}),
		updateUser: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/${data.userId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["User"],
		}),
		createUserMembership: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/membership/${data.membershipId}`,
				method: "POST",
				body: data,
			}),
		}),
		cancelMembership: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/membership/${data.membershipId}`,
				method: "DELETE",
				body: data,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useGetUsersQuery,
	useDeleteUserMutation,
	useGetUserDetailsQuery,
	useUpdateUserMutation,
	useCreateUserMembershipMutation,
	useCancelMembershipMutation
} = usersApiSlice;
