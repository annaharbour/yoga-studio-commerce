const YogaClass = require("../models/YogaClassModel");
const User = require("../models/UserModel");
const stripe = require("stripe")(
	"sk_test_51NX9SUEiiZIWZaNhy8C6xxsEJ0XVoVNVaXVabGKdK1D3IvT4ChzvpYZA02LNFNbcdxbjoiPGLfTLdvXc4KxN5Cw2004K1ZOGpA"
);
const asyncHandler = require("express-async-handler");
// Get all bookings
// Private / Admin Route
// @route DELETE /bookings/:id
module.exports.getClassBookings = asyncHandler(async (req, res) => {
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
	}));

	return res.status(200).json({ studentsSignedUp });
});

// Create Booking
// Private Route
// @route POST /booking/:id
module.exports.createBooking = asyncHandler(async (req, res) => {
	const id = req.params.id;
	const { userId } = req.user;

	try {
		const yogaClass = await YogaClass.findById(id);
		if (!yogaClass) {
			return res.status(404).json({ msg: "Yoga class  not found" });
		}

		const user = await User.findOne({ userId: userId });
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		if (yogaClass.spotsRemaining > 0) {
			try {
				const charge = await stripe.charges.create({
					amount: yogaClass.price * 100,
					currency: "usd",
					source: "tok_visa",
					description: "Charge for test",
				});
				if (charge.status === "succeeded") {
					yogaClass.spotsRemaining--;
					yogaClass.studentsSignedUp.push(user);
					await yogaClass.save();
					await user.save();
					return res.status(200).json({ message: "Booking created" });
				}
			} catch (err) {
				console.log("Charge unsuccessful:", charge.failure_message);
			}
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
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

	const user = await User.findOne({ userId: userId });
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const isBooked = yogaClass.studentsSignedUp.some((studentId) =>
		studentId.equals(user._id)
	);

	if (!isBooked) {
		return res.status(400).json({ msg: "User is not booked for this class" });
	}

	yogaClass.studentsSignedUp = yogaClass.studentsSignedUp.filter(
		(studentId) => !studentId.equals(user._id)
	);

	await yogaClass.save();
	await user.save();

	return res.status(200).json({ message: "Booking canceled" });
});
