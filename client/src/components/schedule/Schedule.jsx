import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useGetClassesQuery } from "../../slices/scheduleSlice";
import YogaClass from "./YogaClass";

export default function Schedule() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedClassTypes, setSelectedClassTypes] = useState([]);

	const { data, isLoading, refetch } = useGetClassesQuery({
		date: selectedDate.toISOString(),
		classTypes: selectedClassTypes,
	});

	const classes = data?.eventList || [];

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
		const selectedClassType = e.target.value;
		setSelectedClassTypes((prevTypes) => {
			if (prevTypes.includes(selectedClassType)) {
				return prevTypes.filter((type) => type !== selectedClassType);
			} else {
				return [...prevTypes, selectedClassType];
			}
		});
	};

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

	useEffect(() => {
		const fetchData = async () => {
			await refetch();
		};
		fetchData();
	}, [refetch, selectedClassTypes, selectedDate]);

	return (
		<>
			<div className="schedule">
				<Calendar
					onChange={handleDateChange}
					view="month"
					value={selectedDate}
					minDate={new Date()}
					maxDate={
						new Date(new Date().setFullYear(new Date().getFullYear() + 2))
					}
					prev2Label={null}
					next2Label={null}
				/>

				<form className="schedule-form">
					<label htmlFor="search">Class Style</label>
					<div className="checkbox-container">
						{classTypes.map((classType) => (
							<div key={classType} className="checkbox-wrapper-24">
								<input
									type="checkbox"
									id={classType}
									name={classType}
									value={classType}
									checked={selectedClassTypes.includes(classType)}
									onChange={handleClassTypeChange}
								/>
								<label htmlFor={classType}>
									<span></span>
									{classType}
								</label>
							</div>
						))}
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
				</form>
			</div>
			{isLoading ? (
				<div>Loading</div>
			) : (
				<>
					{classes.length === 0 ? (
						<p className="no-classes">No classes found for the selected date and yoga style.</p>
					) : (
						<div className="yoga-class-grid">
							<div className="selected-date">{selectedDate.toLocaleDateString()}</div>
						{classes.map((c) => (
							<YogaClass
								key={c._id}
								classType={c.classType}
								startTime={new Date(c.start).toLocaleTimeString()}
								endTime={new Date(c.start).toLocaleTimeString()}
								price={c.price}
								maxCapacity={c.maxCapacity}
								spotsRemaining={c.spotsRemaining}
							/>
						))}
						</div>
					)}
				</>
			)}
		</>
	);
}
