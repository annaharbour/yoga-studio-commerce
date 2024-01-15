import React, { useEffect, useState } from "react";
import { Link, useLocation, redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useRegisterMutation } from "../../slices/usersSlice";
import { toast } from "react-toastify";

function Register() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNr, setPhoneNr] = useState("");
	const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('')

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [register] = useRegisterMutation();

	const { userInfo } = useSelector((state) => state.auth);

	const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, navigate]);

	const submitHandler = async (e) => {
    e.preventDefault()
    if(password!==confirmPassword){
      toast.error('Password do not match')
    } else {
      try {
        const res = await register({email, firstName, lastName, phoneNr, password}).unwrap()
        dispatch(setCredentials({...res}))
        navigate(redirect)
      } catch(err){
        toast.error(err?.data?.message || err.error)
        console.error(err)
      }
    }
  }
	

	return (
		<div className="form">
			<h1>Sign Up</h1>
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
				<button type="submit">Sign Up</button>
			</form>
			<div className="auth-link">No account? <Link to='/login'>Sign in here</Link></div>

		</div>
	);
  }

export default Register;
