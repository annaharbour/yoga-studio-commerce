const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

module.exports.signup = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password, phoneNr } = req.body;

	if (!firstName || !lastName || !email || !phoneNr || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ msg: "Email already in use" });
		} else {
			const userId = uuidv4();
			const newUser = new User({
				userId,
				firstName,
				lastName,
				phoneNr,
				email,
				password,
			});

			const hash = await bcrypt.hash(password, 10);
			newUser.password = hash;

			const response = await newUser.save();

			return res.status(201).json({
				msg: "User created",
				result: response,
				success: true,
			});
		}
	} catch (err) {
		return res.status(500).json({ error: err });
	}
});

module.exports.login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ msg: "No user found" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ msg: "Authentication Failed" });
		}

		const { userId } = user;
		const jwtToken = jwt.sign(
			{
				email,
				userId,
			},
			process.env.JWTSecret,
			{
				expiresIn: "1h",
			}
		);

		return res.status(200).json({
			accessToken: jwtToken,
			userId,
		});
	} catch (err) {
		return res.status(401).json({
			message: err.message,
			success: false,
		});
	}
});

module.exports.logout = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});
	res.status(200).json({ msg: "Logout successful" });
});
