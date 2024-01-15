import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../common/constants";

import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
});

async function baseQueryWithAuth(args, api, extra) {
	const result = await baseQuery(args, api, extra);
	console.log(args)
	console.log(result)
	if (result.error && result.error.status === 401) {
		api.dispatch(logout());
	}
	return result;
}

export const apiSlice = createApi({
	baseQuery: baseQueryWithAuth,
	tagTypes: ["User"],
	endpoints: (builder) => ({}),
});
