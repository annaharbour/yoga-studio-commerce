import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {


	return (
		<div className="nav">
			<ul>
				<Link to='/'>Home</Link>
				<Link to='/schedule'>Schedule</Link>
				<Link to='/memberships'>Memberships</Link>
				<Link to='/retreats'>Retreats</Link>
			</ul>
			<div className="auth">
				{/* Check for user info
				 */}
				<Link to='/login'>Login</Link>
			</div>
		</div>
	);
}
