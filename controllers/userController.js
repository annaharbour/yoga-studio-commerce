const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

module.exports.signup = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password, phoneNr, isAdmin } = req.body;

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

		const { userId } = user;
		const jwtToken = jwt.sign(
			{
				email,
				userId,
				isAdmin
			},
			process.env.JWTSecret,
			{
				expiresIn: "1h",
			}
		);

		res.cookie('accessToken', jwtToken, { httpOnly: true, maxAge: 3600000 }); 

		return res.status(200).json({
			accessToken: jwtToken,
			userId,
			isAdmin
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
			const { firstName, lastName } = verifyUser;
			return res.status(200).json({
				msg: `User: ${firstName} ${lastName}`,
			});
		}
	} catch (error) {
		return res.status(401).json({ msg: error.message });
	}
});

module.exports.getUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find();
		console.log(users);
		if (!users || users.length === 0) {
			return res.status(404).json({ msg: "No users found" });
		}

		const userList = users.map((user) => {
			const { _id, firstName, lastName, email } = user;
			return { _id, firstName, lastName, email };
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
})

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
