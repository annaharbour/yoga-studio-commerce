import React from "react";

function YogaClass({
	classType,
	startTime,
	endTime,
	price,
	location,
	maxCapacity,
	spotsRemaining,
}) {
	return (
		<div className="yoga-class">
			<p>Class Style: {classType}</p>
			<p>Start Time: {startTime}</p>
			<p>End Time: {endTime}</p>
			<p>Price: {price}</p>
			<p>Location: {location}</p>
			<div className="book-class">
				{spotsRemaining} of {maxCapacity} spots left!
				<button className="book-class-button">Book now</button>
			</div>
		</div>
	);
}

export default YogaClass;

