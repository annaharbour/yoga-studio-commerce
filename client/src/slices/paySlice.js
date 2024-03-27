import { createSlice } from "@reduxjs/toolkit";

const paySlice = createSlice({
	name: "pay",
	initialState: {
		userInfo: null,
	},
	reducers: {
		setCredentials(state, action) {
			state.userInfo = action.payload;
		},
		logout(state) {
			state.userInfo = null;
		},
	},
});

export const { setCredentials, logout} = paySlice.actions;

export default paySlice.reducer;