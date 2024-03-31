import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useLoginMutation } from "../../slices/usersSlice";
import { toast } from "react-toastify";

function Login() {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [login] = useLoginMutation();

	const { userInfo } = useSelector((state) => state.auth);

	const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, redirect, navigate]);

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			// unwrap will resolve to the value of fulfilled action, 
			const res = await login({ email, password }).unwrap();
			// dispatches action that sets state.userInfo to email and password
			dispatch(setCredentials({ ...res }));
			// redirects back to home page
			navigate(redirect);
		} catch (err) {
			 toast.error(err?.data?.msg || err.message)
		}
	}

	return (
		<div className="form">
			<h1>Sign In</h1>
			<form onSubmit={submitHandler}>
				
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
				<button className="submit-button" type="submit">Sign In</button>
			</form>
			<div className="auth-link">No account? <Link to='/register'>Sign up here</Link></div>
		</div>

	);
}

export default Login;
