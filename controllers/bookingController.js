const YogaClass = require("../models/YogaClass");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

// Get all bookings
// Private / Admin Route
// @route DELETE /bookings/:id
module.exports.getClassBookings = asyncHandler(async (req, res) => {
	// Find the YogaClass by its ID and populate the studentsSignedUp field
	const yogaClass = await YogaClass.findById(req.params.id).populate(
		"studentsSignedUp"
	);

	if (!yogaClass) {
		return res.status(404).json({ msg: "Yoga class not found" });
	}

	const studentsSignedUp = yogaClass.studentsSignedUp.map((student) => ({
		userId: student.userId,
		firstName: student.firstName,
		lastName: student.lastName,
		email: student.email,
		phoneNr: student.phoneNr,
		membership: student.membership,
		classesTaken: student.classesTaken,
	}));

	return res.status(200).json({ studentsSignedUp });
});

// Create Booking
// Private Route
// @route POST /booking/:id
module.exports.createBooking = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { userId } = req.user;

	const yogaClass = await YogaClass.findById(id);

	if (!yogaClass) {
		return res.status(404).json({ msg: "Yoga class not found" });
	}

	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ msg: "User not found" });
	}

	let bookingPrice = 0;

	if (user.membership !== "none") {
		bookingPrice = yogaClass.price;
	}

	if (yogaClass.spotsRemaining > 0) {
		yogaClass.spotsRemaining--;

		yogaClass.studentsSignedUp.push(userId);

		await yogaClass.save();
		await user.save();

		return res.status(201).json({ message: "Booking created" });
	} else {
		return res.status(400).json({ message: "No spots remaining in class" });
	}
});

// Canceling Booking
// Private Route
// @route DELETE /bookings/:id
module.exports.cancelBooking = asyncHandler(async (req, res) => {
	const { userId } = req.user;

	const yogaClass = await YogaClass.findById(req.params.id);

	if (!yogaClass) {
		return res.status(404).json({ message: "Yoga class not found" });
	}

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const isBooked = yogaClass.studentsSignedUp.includes(userId);

	if (!isBooked) {
		return res.status(400).json({ msg: "User is not booked for this class" });
	}

	yogaClass.studentsSignedUp = yogaClass.studentsSignedUp.filter(
		(student) => student.userId !== userId
	);

	await yogaClass.save();
	await user.save();

	return res.status(200).json({ message: "Booking canceled" });
});
