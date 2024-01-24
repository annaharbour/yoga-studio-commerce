import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation } from "../../slices/usersSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

function Profile() {
	const { userInfo } = useSelector((state) => state.auth);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNr, setPhoneNr] = useState("");
	const dispatch = useDispatch();

	const [updateUser, { isLoading }] = useUpdateUserMutation();

	useEffect(() => {
		if (userInfo) {
			setFirstName(userInfo.firstName || "");
			setLastName(userInfo.lastName || "");
			setEmail(userInfo.email || "");
			setPhoneNr(userInfo.phoneNr || "");
		}
	}, [userInfo, isLoading]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await updateUser(
				{
					userId: userInfo.userId,
					firstName,
					lastName,
					email,
					phoneNr,
				},
				{
					headers: {
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
				}
			);

			dispatch(setCredentials({ ...res.data }));
			toast.success("Profile updated successfully");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
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
				{isLoading && <div>'Loading...'</div>}
				<button type="submit">Update Profile</button>
			</form>
		</div>
	);
}

export default Profile;
