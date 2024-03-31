import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../common/constants";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	prepareHeaders: (headers, { getState }) => {
		if (getState().auth.userInfo !== null) {
			const token = getState().auth.userInfo.accessToken;
			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			}
		}
		return headers;
	},
});

async function baseQueryWithAuth(args, api, extra) {
	const result = await baseQuery(args, api, extra);
	if (result.error && result.error.status === 401) {
		api.dispatch(logout());
	}
	return result;
}

export const apiSlice = createApi({
	baseQuery: baseQueryWithAuth,
	tagTypes: ["User", "YogaClass"],
	endpoints: (builder) => ({}),
});

