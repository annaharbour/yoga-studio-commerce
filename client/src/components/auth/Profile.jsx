import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} from "../../slices/usersSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

function Profile() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNr, setPhoneNr] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.auth);
	const [updateUser] = useUpdateUserMutation();

	useEffect(() => {
		setFirstName(userInfo.firstName);
		setLastName(userInfo.lastName);
		setEmail(userInfo.email);
		setPhoneNr(userInfo.phoneNr);
		setPassword(userInfo.password);
	}, [
		userInfo.firstName,
		userInfo.lastName,
		userInfo.phoneNr,
		userInfo.email,
		userInfo.password,
	]);

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Password do not match");
		} else {
			try {
				const res = await updateUser({
					_id: userInfo._id,
					firstName,
					lastName,
					email,
					phoneNr,
					password,
				}).unwrap();
				dispatch(setCredentials({ ...res }));
				toast.success("Profile updated successfully");
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	return (
		<div className="form">
			<h1>Account</h1>
			<form onSubmit={submitHandler}>
				<label htmlFor="firstName">First Name:</label>
				<input
					type="text"
					name="firstName"
					id="firstName"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
				<label htmlFor="lastName">Last Name:</label>
				<input
					type="text"
					name="lastName"
					id="lastName"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<label htmlFor="phoneNr">Phone Number:</label>
				<input
					type="tel"
					name="phoneNr"
					id="phoneNr"
					value={phoneNr}
					pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
					onChange={(e) => setPhoneNr(e.target.value)}
					required
				/>

				<label htmlFor="password">Password:</label>
				<input
					type="password"
					name="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<label htmlFor="confirmPassword">Confirm Password:</label>
				<input
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<button type="submit">Update Profile</button>
			</form>
		</div>
	);
}

export default Profile;
