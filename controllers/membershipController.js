const Membership = require("../models/MembershipModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

// Get list of all members
// Admin / Private Route
// @route GET /membership/members
module.exports.getMembers = asyncHandler(async (req, res) => {
	try {
		const members = await User.find({ membership: { $exists: true } }).populate(
			"membership"
		);
		return res.status(200).json({ members });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
});

// Get Membership Plans
// Public Route
// @route GET /membership/plans
module.exports.getMembershipPlans = asyncHandler(async (req, res) => {
	try {
		const memberships = await Membership.find();

		if (!memberships) {
			return res.status(404).json({ msg: "No membership plans found" });
		}
		const membershipDetails = memberships.map((membership) => ({
			membershipType: membership.membershipType,
			details: membership.description,
			billingFreq: membership.billingFreq,
			price: membership.price,
		}));

		return res.status(200).json({ membershipDetails });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
});

// Get Membership Plans
// Public Route
// @route GET /membership/plan/:id
module.exports.getMembershipPlanById = asyncHandler(async (req, res) => {
	const membershipPlan = await Membership.findById(req.params.id);

	if (membershipPlan) {
		res.status(200).json(membershipPlan);
	} else {
		res.status(404);
		throw new Error("Membership plan not found");
	}
});

// Update Membership Plan
// Admin/Private Route
// @route PUT /membership/plan/:id
module.exports.updateMembershipPlan = asyncHandler(async (req, res) => {
	const { membershipType, description, billingFreq, price } = req.body;

	const membershipPlan = await Membership.findById(req.params.id);

	if (membershipPlan) {
		membershipPlan.membershipType = membershipType;
		membershipPlan.description = description;
		membershipPlan.billingFreq = billingFreq;
		membershipPlan.price = price;

		const updatedMembershipPlan = await membershipPlan.save();
		res.json(updatedMembershipPlan);
	} else {
		res.status(404);
		throw new Error("Membership plan not found");
	}
});

// Delete Class
// Admin / Private Route
// @route DELETE /membership/plan/:id
module.exports.deleteClassById = asyncHandler(async (req, res) => {
	const membershipPlan = await Membership.findById(req.params.id);
	try {
		await MemberShipPlan.deleteOne({ _id: membershipPlan._id });
		res.status(200).json({ message: "Member plan deleted successfully" });
	} catch (err) {
		res.status(400).json({ message: "Membership plan deletion failed" });
	}
});

// Create new membership plan
// Admin / Private Route
// @route POST /membership/plan
module.exports.createMembershipPlan = asyncHandler(async (req, res) => {
	const { membershipType, description, billingFreq, price } = req.body;

	if (!membershipType || !description || !billingFreq || !price) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	try {
		const newPlan = new Membership({
			membershipType,
			description,
			billingFreq,
			price,
		});

		await newPlan.save();

		return res.status(201).json({ msg: "Membership plan created" });
	} catch (err) {
		console.error("Error creating user:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Sign up for a membership
// @route POST /membership/signup
// @access Private 
module.exports.signupForMembership = asyncHandler(async (req, res) => {
	const { userId } = req.user; 
  
	try {
	  const membership = await Membership.findOne(req.params.id);
  
	  if (!membership) {
		return res.status(404).json({ msg: 'Membership not found' });
	  }
  
	  const user = await User.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ msg: 'User not found' });
	  }
  
	  if (user.membership) {
		return res.status(400).json({ msg: 'User is already a member' });
	  }
  
	  user.membership = membership._id;
	  await user.save();
  
	  return res.status(201).json({ msg: 'Membership signed up successfully' });
	} catch (error) {
	  return res.status(500).json({ msg: error.message });
	}
  });