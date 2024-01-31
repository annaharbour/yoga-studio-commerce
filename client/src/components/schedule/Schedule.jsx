import { useState } from "react";
import Calendar from "react-calendar";

export default function Schedule() {
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Event Handlers for Day, Month, Year
	const generateDaysOptions = () => {
		const daysInMonth = new Date(
			selectedDate.getFullYear(),
			selectedDate.getMonth() + 1,
			0
		).getDate();

		const daysArray = Array.from(
			{ length: daysInMonth },
			(_, index) => index + 1
		);

		return daysArray.map((day) => (
			<option key={day} value={day}>
				{day}
			</option>
		));
	};

	const months = [
		"01",
		"02",
		"03",
		"04",
		"05",
		"06",
		"07",
		"08",
		"09",
		"10",
		"11",
		"12",
	];

	const getCurrentYear = new Date().getFullYear();
	const years = [getCurrentYear, getCurrentYear + 1, getCurrentYear + 2];

	const handleMonthChange = (e) => {
		const selectedMonth = e.target.value;
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(months.indexOf(selectedMonth));
		setSelectedDate(updatedDate);
	};

	const handleDayChange = (e) => {
		const selectedDay = e.target.value;
		const updatedDate = new Date(selectedDate);
		updatedDate.setDate(selectedDay);
		setSelectedDate(updatedDate);
	};

	const handleYearChange = (e) => {
		const selectedYear = e.target.value;
		const updatedDate = new Date(selectedDate);
		updatedDate.setFullYear(selectedYear);
		setSelectedDate(updatedDate);
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const onSearch = (e) => {
		e.preventDefault();
		console.log("Search");
	};

	return (
		<div className="form">
			<h1>Schedule</h1>

			<form className="schedule-filter" onSubmit={onSearch}>

				<div>
					<input className="search" placeholder="Search for classes"></input>
				</div>

				<div>
					<label htmlFor="search">Filter</label>
					<select name="class-type">
						<option value="ashtanga">Ashtanga</option>
						<option value="vinyasa">Vinyasa</option>
						<option value="power">Power</option>
					</select>
				</div>

				<div>
					<label htmlFor="date">Date:</label>
					<select
						name="month"
						value={months[selectedDate.getMonth()]}
						onChange={handleMonthChange}>
						{months.map((month) => (
							<option key={month} value={month}>
								{month}
							</option>
						))}
					</select>
					<select
						name="day"
						value={selectedDate.getDate()}
						onChange={handleDayChange}>
						{generateDaysOptions()}
					</select>
					<select
						name="year"
						value={selectedDate.getFullYear()}
						onChange={handleYearChange}>
						{years.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>

					{/* Select range */}
				</div>
			</form>
			<Calendar
				onChange={handleDateChange}
				view="month"
				value={selectedDate}
				minDate={new Date()}
				maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
				prev2Label={null}
				next2Label={null}
				className="schedule"
			/>
			<div>Selected Date: {selectedDate.toLocaleDateString()}</div>
			<div>Render classes for this day here</div>
		</div>
	);
}
