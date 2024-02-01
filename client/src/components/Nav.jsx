import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersSlice";
import { logout } from "../slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
	faHouse,
	faUser,
	faCalendarDays,
	faAddressCard,
	// faPlane,
	faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const [logoutCall] = useLogoutMutation();
	const ref = useRef();


	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen);
	};

	const logoutHandler = async () => {
		try {
			await logoutCall().unwrap();
			dispatch(logout());
		} catch (err) {
			toast.error(err?.data?.msg || err.message);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
		  if (!ref?.current?.contains(event.target)) {
			setDropdownOpen(false);
		  }
		};
	  
		if (ref.current) {
		  document.addEventListener("mousedown", handleClickOutside);
		}
	  
		// Cleanup the event listener when the component is unmounted
		return () => {
		  document.removeEventListener("mousedown", handleClickOutside);
		};
	  }, [ref]);
	  

	return (
		<div className="nav">
			<ul>
				<li>
					<Link to="/">
						<div className="nav-item">
							<FontAwesomeIcon icon={faHouse} className="nav-icon" />
							<span className="nav-text">Home</span>
						</div>
					</Link>
				</li>
				<li>
					<Link to="/schedule">
						<div className="nav-item">
							<FontAwesomeIcon icon={faCalendarDays} className="nav-icon" />
							<span className="nav-text">Schedule</span>
						</div>
					</Link>
				</li>
				<li>
					<Link to="/memberships">
						<div className="nav-item">
							<FontAwesomeIcon icon={faAddressCard} className="nav-icon" />
							<span className="nav-text">Memberships</span>
						</div>
					</Link>
				</li>
				{/* <li>
					<Link to="/retreats">
						<div className="nav-item">
							<FontAwesomeIcon icon={faPlane} className="nav-icon" />
							<span className="nav-text">Retreats</span>
						</div>
					</Link>
				</li> */}
				<li>
					<div className="nav-item">
						{userInfo ? (
							<div onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown} ref={ref}>
								<div
									className={`user-links nav-icon ${
										isDropdownOpen ? "active" : ""
									}`}
									onClick={toggleDropdown}>
									<FontAwesomeIcon icon={faUser} />

									<span className="nav-text">
										<FontAwesomeIcon icon={faCaretDown} />
									</span>
								</div>

								{isDropdownOpen && (
									<div className="user-links-dropdown">
										<Link className="dropdown-link" to="/account">
											Account
										</Link>
										<Link className="dropdown-link" onClick={logoutHandler}>
											Logout
										</Link>
									</div>
								)}
							</div>
						) : (
							<div onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
								<div
									className={`user-links nav-icon ${
										isDropdownOpen ? "active" : ""
									}`}
									onClick={toggleDropdown}>
									<FontAwesomeIcon icon={faUser} />
									<span className="nav-text">
										<FontAwesomeIcon icon={faCaretDown} />
									</span>
								</div>

								{isDropdownOpen && (
									<div className="user-links-dropdown">
										<Link to="/login" className="dropdown-link" >
											Login
										</Link>
									</div>
								)}
							</div>
						)}
					</div>
				</li>
			</ul>
		</div>
	);
}
