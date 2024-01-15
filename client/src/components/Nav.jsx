import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersSlice";
import { logout } from "../slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faUser,
	faCalendarDays,
	faCaretDown,
	faAddressCard,
	faPlane,
} from "@fortawesome/free-solid-svg-icons";

 

export default function Nav() {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const [logoutCall] = useLogoutMutation();

	const logoutHandler = async () => {
		try {
			await logoutCall().unwrap();
			dispatch(logout());
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="nav">
			<ul>
				<Link to="/">
					{" "}
					<FontAwesomeIcon icon={faHouse} className="nav-icon"/>
					Home
				</Link>
				<Link to="/schedule">
					<FontAwesomeIcon icon={faCalendarDays} className="nav-icon"/>
					Schedule
				</Link>
				<Link to="/memberships">
					<FontAwesomeIcon icon={faAddressCard} className="nav-icon"/>
					Memberships
				</Link>
				<Link to="/retreats">
					<FontAwesomeIcon icon={faPlane} className="nav-icon"/>
					Retreats
				</Link>
			</ul>
			<div className="auth">
				{userInfo ? (
					<>
						<div className="user-links">
							<FontAwesomeIcon icon={faUser} />
							<FontAwesomeIcon icon={faCaretDown} />
						</div>
						<div className="user-links-dropdown">
							<Link onClick={logoutHandler}>Logout</Link>
						</div>
					</>
				) : (
					<>
						<FontAwesomeIcon icon={faUser} className="nav-icon" />
						<Link to="/login">Sign In 
						</Link>
					</>
				)}
			</div>
		</div>
	);
}
