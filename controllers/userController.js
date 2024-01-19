const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const Membership = require("../models/MembershipModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

module.exports.signup = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password, phoneNr, isAdmin } = req.body;

	if (!firstName || !lastName || !email || !phoneNr || !password) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ msg: "Invalid email format" });
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
				isAdmin,
			});

			const hash = await bcrypt.hash(password, 10);
			newUser.password = hash;

			await newUser.save();

			return res.status(201).json({ msg: "User created" });
		}
	} catch (err) {
		console.error("Error creating user:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

module.exports.login = asyncHandler(async (req, res) => {
	const { email, password, isAdmin } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ msg: "No user found" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ msg: "Authentication Failed" });
		}

		const { userId, firstName, lastName, phoneNr } = user;
		const jwtToken = jwt.sign(
			{
				email,
				userId,
				isAdmin
				
			},
			process.env.JWTSecret,
			{
				expiresIn: "2h",
			}
		);

		res.cookie("accessToken", jwtToken, { httpOnly: true, maxAge: 3600000 });

		return res.status(200).json({
			accessToken: jwtToken,
			email,
			userId,
			isAdmin,
			firstName,
			lastName,
			phoneNr
		});
	} catch (err) {
		return res.status(401).json({
			msg: err.message,
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

module.exports.getUser = asyncHandler(async (req, res) => {
	const { id } = req.params;

	try {
		const verifyUser = await User.findOne({ userId: id });
		if (!verifyUser) {
			return res.status(403).json({ msg: "User not found" });
		} else {
			return res.status(200).json({
				verifyUser
			});
		}
	} catch (error) {
		return res.status(401).json({ msg: error.message });
	}
});

module.exports.getUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find();
		if (!users || users.length === 0) {
			return res.status(404).json({ msg: "No users found" });
		}

		const userList = users.map((user) => {
			const {
				_id,
				firstName,
				lastName,
				email,
				phoneNr,
				isAdmin,
				isInstructor,
				membership,
			} = user;
			return {
				_id,
				firstName,
				lastName,
				email,
				phoneNr,
				isAdmin,
				isInstructor,
				membership,
			};
		});

		return res.status(200).json({
			users: userList,
		});
	} catch (err) {
		return res.status(401).json({ msg: err.message });
	}
});

module.exports.updateUser = asyncHandler(async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({ userId: id });
		if (!user) {
			return res.status(403).json({ msg: "User not found" });
		} else {
			user.firstName = req.body.firstName || user.firstName;
			user.lastName = req.body.lastName || user.lastName;
			user.email = req.body.email || user.email;
			user.phoneNr = req.body.phoneNr || user.phoneNr;
			user.password = req.body.password || user.password;

			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();

			res.status(200).json({
				userId: updatedUser.userId,
				firstName: updatedUser.firstName,
				lastName: updatedUser.lastName,
				email: updatedUser.email,
				phoneNr: updatedUser.phoneNr,
				isAdmin: updatedUser.isAdmin,
			});
		}
	} catch (error) {
		return res.status(401).json({ msg: error.message });
	}
});

module.exports.deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		if (user.isAdmin) {
			res.status(400);
			throw new Error("Cannot delete admin user");
		}
		await User.deleteOne({ _id: user._id });
		res.status(200).json({ message: "User deleted successfully" });
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// PUT update membership
// Private Route
// @ auth/member
module.exports.createUserMembership = asyncHandler(async (req, res) => {
	const { userId } = req.user;
	const id = req.params.id;

	const membership = await Membership.findById(id);
	if (!membership) {
		return res.status(404).json({ msg: "Membership plan not found" });
	}

	try {
		const user = await User.findOne({ userId: userId });

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		if (user.membership) {
			return res.status(400).json({ msg: "User already has a membership" });
		}

		user.membership = membership;
		await user.save();

		return res.status(200).json({ msg: "Membership created successfully" });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});

// Delete user's membership
// @route DELETE /membership/delete
// @access Private
module.exports.cancelMembership = asyncHandler(async (req, res) => {
	const { userId } = req.user;
	const id = req.params.id;

	const membership = await Membership.findById(id);
	if (!membership) {
		return res.status(404).json({ msg: "Membership plan not found" });
	}

	try {
		const user = await User.findOne({ userId: userId });

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		if (!user.membership) {
			return res.status(400).json({ msg: "User has no membership yet" });
		}

		user.membership = null;
		await user.save();

		return res.status(200).json({ msg: "Membership canceled successfully" });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});


