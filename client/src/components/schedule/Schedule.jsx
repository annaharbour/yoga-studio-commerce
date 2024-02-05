import { useState } from "react";
import Calendar from "react-calendar";
import { useGetClassesQuery } from "../../slices/scheduleSlice";

export default function Schedule() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedClassType, setSelectedClassType] = useState("");

	const { data, isLoading, error, refetch } = useGetClassesQuery({
		date: selectedDate.toISOString(),
		...(selectedClassType.length > 0 && { classType: selectedClassType }),
	});

	const classes = data?.eventList || [];

	// Event Handlers for Day, Month, Year, Class Types
	const classTypes = [
		"Power",
		"Nidra",
		"Vinyasa",
		"Hatha",
		"Iyengar",
		"Kundalini",
		"Ashtanga",
		"Bikram",
		"Yin",
		"Workshop",
		"Yoga Teacher Certification",
		"Yoga Retreat",
	];

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

	const handleClassTypeChange = (e) => {
		e.preventDefault();
		const selectedClassType = e.target.value;
		setSelectedClassType(selectedClassType);
	};

	const handleMonthChange = (e) => {
		e.preventDefault();
		const selectedMonth = e.target.value;
		const updatedDate = new Date(selectedDate);
		updatedDate.setMonth(months.indexOf(selectedMonth));
		setSelectedDate(updatedDate);
	};

	const handleDayChange = (e) => {
		e.preventDefault();
		const selectedDay = e.target.value;
		const updatedDate = new Date(selectedDate);
		updatedDate.setDate(selectedDay);
		setSelectedDate(updatedDate);
	};

	const handleYearChange = (e) => {
		e.preventDefault();
		const selectedYear = e.target.value;
		const updatedDate = new Date(selectedDate);
		updatedDate.setFullYear(selectedYear);
		setSelectedDate(updatedDate);
	};

	const handleDateChange = (e, date) => {
		e.preventDefault();
		setSelectedDate(date);
	};

	const onSearch = async (e) => {
		e.preventDefault();
		try {
			// Fetch data here
			await refetch(); // Assuming refetch is a function from useGetClassesQuery
		} catch (error) {
			console.error("Error loading classes:", error);
		}
	};

	return (
		<div className="form">
			<h1>Schedule</h1>

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

			<form className="schedule-filter" onSubmit={onSearch}>
				<div>
					<input className="search" placeholder="Search for classes"></input>
				</div>

				<div>
					<label htmlFor="search">Filter</label>
					<select
						name="class-type"
						onChange={handleClassTypeChange}
						value={selectedClassType}>
						<option value="">All Classes</option>
						{classTypes.map((classType) => (
							<option key={classType} value={classType}>
								{classType}
							</option>
						))}
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
				</div>
				<button type="submit">Search</button>

			</form>
			<div>Render classes for this day here</div>

			{isLoading ? (
				<div>Loading</div>
			) : (
				<>
					{classes.length === 0 ? (
						<p>
							No classes found for the selected date and type.
						</p>
					) : ( 
						classes.map((c) => (				
						<div key={c._id}>
							<p>Class Type: {c.classType}</p>
							<p>Start Time: {new Date(c.start).toLocaleTimeString()}</p> 
						</div>)
					))}
				</>
			)}
		</div>
	);
}
