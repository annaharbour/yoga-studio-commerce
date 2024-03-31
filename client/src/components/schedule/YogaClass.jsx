import React from "react";
import { useNavigate } from "react-router";

function YogaClass({
	classType,
	startTime,
	endTime,
	price,
	location,
	maxCapacity,
	spotsRemaining,
	classId,
}) {
	const onClick = async (e) => {
		e.preventDefault();
		try {
			navigate("/checkout", {
				state: {
						classType,
						startTime,
						endTime,
						price,
						classId,
					
				},
			});
		} catch (err) {
			console.log(err.err);
		}
	};

	const navigate = useNavigate();

	return (
		<>
			<div className="yoga-class">
				<h3>{classType}</h3>
				<p>
					{startTime} - {endTime}
				</p>
				<p>{location}</p>
				<div className="book-class">
					{spotsRemaining} of {maxCapacity} spots left! Only ${price}!
					<button className="book-class-button" onClick={onClick}>
						BOOK NOW
					</button>
				</div>
			</div>
			<div className="line"></div>
		</>
	);
}

export default YogaClass;
