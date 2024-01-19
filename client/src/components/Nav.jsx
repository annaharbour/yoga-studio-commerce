import React, { useState } from "react";
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
	faCaretUp,
	faAddressCard,
	faPlane,
} from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const [logoutCall] = useLogoutMutation();

	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen);
	};

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
					<FontAwesomeIcon icon={faHouse} className="nav-icon" />
					Home
				</Link>
				<Link to="/schedule">
					<FontAwesomeIcon icon={faCalendarDays} className="nav-icon" />
					Schedule
				</Link>
				<Link to="/memberships">
					<FontAwesomeIcon icon={faAddressCard} className="nav-icon" />
					Memberships
				</Link>
				<Link to="/retreats">
					<FontAwesomeIcon icon={faPlane} className="nav-icon" />
					Retreats
				</Link>
			</ul>
			<div className="auth">
				{userInfo ? (
					<div className="dropdown-container">
						<div
							className={`user-links ${isDropdownOpen ? "active" : ""}`}
							onClick={toggleDropdown}>
							<FontAwesomeIcon icon={faUser} className="nav-icon" />

							<FontAwesomeIcon
								icon={!isDropdownOpen ? faCaretDown : faCaretUp}
								className="nav-icon"
							/>
						</div>
						{isDropdownOpen && (
							<div className="user-links-dropdown">
								
								<Link to='/account'>Account</Link>
								<Link onClick={logoutHandler}>Logout</Link>
							</div>
						)}
					</div>
				) : (
					<>
						<FontAwesomeIcon icon={faUser} className="nav-icon" />
						<Link to="/login">Sign In</Link>
					</>
				)}
			</div>
		</div>
	);
}
