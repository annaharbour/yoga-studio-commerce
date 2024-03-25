import React from "react";

function YogaClass({
	classType,
	startTime,
	endTime,
	price,
	location,
	maxCapacity,
	spotsRemaining,
	instructor
}) {

	return (
		<>
		<div className="yoga-class">
			<h3>{classType}</h3>
			<p>{instructor ? instructor : 'Instructor TBD'}</p>
			<p>{startTime} - {endTime}</p>
			<p>{location}</p>
			<div className="book-class">
				{spotsRemaining} of {maxCapacity} spots left! Only ${price}!
				<button className="book-class-button">BOOK NOW</button>
			</div>
		</div>
		<div className="line"></div>
		</>
	);
}

export default YogaClass;

