const YogaClass = require("../models/YogaClassModel");
const Membership = require("../models/MembershipModel")
const asyncHandler = require("express-async-handler");

// Get calendar of bookable classes
// Public Route
// @route GET /classes
// module.exports.getClasses = asyncHandler(async (req, res) => {
// 	try {
// 		const events = await YogaClass.find();
// 		console.log(events);
// 		if (!events || events.length === 0) {
// 			return res.status(404).json({ msg: "No classes found" });
// 		}

// 		const eventList = events.map((event) => {
// 			const {
// 				classType,
// 				start,
// 				end,
// 				price,
// 				location,
// 				spotsRemaining,
// 				maxCapacity,
// 				studentsSignedUp,
// 				_id
// 			} = event;
// 			return {
// 				classType,
// 				start,
// 				end,
// 				price,
// 				location,
// 				spotsRemaining,
// 				maxCapacity,
// 				studentsSignedUp,
// 				_id
// 			};
// 		});
// 		return res.status(200).json({
// 			events: eventList,
// 		});
// 	} catch (err) {
// 		return res.status(401).json({ msg: err.message });
// 	}
// });

// Get calendar of bookable classes
// Public Route
// @route GET /classes
module.exports.getClasses = asyncHandler(async (req, res) => {
	try {
	  // Extract parameters from the query
	  const { date, classType } = req.query;
  
	  // Build the filter object based on the presence of parameters
	  const filter = {};
	  if (date) {
		filter.start = { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) };
	  }
	  if (classType) {
		filter.classType = classType;
	  }
  
	  // Use the filter object in the query
	  const events = await YogaClass.find(filter);
  
	  if (!events || events.length === 0) {
		return res.status(404).json({ msg: "No classes found" });
	  }
  
	  const eventList = events.map((event) => {
		const {
		  classType,
		  start,
		  end,
		  price,
		  location,
		  spotsRemaining,
		  maxCapacity,
		  studentsSignedUp,
		  _id
		} = event;
		return {
		  classType,
		  start,
		  end,
		  price,
		  location,
		  spotsRemaining,
		  maxCapacity,
		  studentsSignedUp,
		  _id
		};
	  });
  
	  return res.status(200).json({
		events: eventList,
	  });
	} catch (err) {
	  return res.status(401).json({ msg: err.message });
	}
  });
  
  

// Create New Class
// Admin / Private Route
// @route POST /class
module.exports.createClass = asyncHandler(async (req, res) => {
	const {
		classType,
		start,
		end,
		price,
		location,
		maxCapacity
	} = req.body;

	if (
		!classType ||
		!start ||
		!end ||
		!price ||
		!location ||
		!maxCapacity
	) {
		return res.status(400).json({ msg: "Please enter all fields" });
	}

	try {
		const newClass = new YogaClass({
			classType,
			start,
			end,
			price,
			location,
			maxCapacity,
			
		});

		await newClass.save();

		return res.status(201).json({ msg: "New yoga class created" });
	} catch (err) {
		console.error("Error creating class:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Get Class By Id
// Public Route
// @route GET /class/:id
module.exports.getClassById = asyncHandler(async (req, res) => {
	const yogaClass = await YogaClass.findById(req.params.id);

	if (yogaClass) {
		res.status(200).json(yogaClass);
	} else {
		res.status(404);
		throw new Error("Yoga class not found");
	}
});

// Update Class
// Admin / Private Route
// @route PUT /class/:id
module.exports.updateClassById = asyncHandler(async (req, res) => {
	try {
		const yogaClass = await YogaClass.findById(req.params.id);
		if (!yogaClass) {
			return res.status(403).json({ msg: "Class not found" });
		} else {
			yogaClass.classType = req.body.classType || yogaClass.classType;
			yogaClass.start = req.body.start || yogaClass.start;
			yogaClass.end = req.body.end || yogaClass.end;
			yogaClass.price = req.body.price || yogaClass.price;
			yogaClass.location = req.body.location || yogaClass.location;
			yogaClass.maxCapacity = req.body.maxCapacity || yogaClass.maxCapacity;

			if (req.body.password) {
				yogaClass.password = req.body.password;
			}

			const updatedYogaClass = await yogaClass.save();

			res.status(200).json({
				
				classType: updatedYogaClass.classType,
				start: updatedYogaClass.start,
				end: updatedYogaClass.end,
				price: updatedYogaClass.price,
				location: updatedYogaClass.location,
				maxCapacity: updatedYogaClass.maxCapacity,
			});
		}
	} catch (error) {
		return res.status(401).json({ msg: error.message });
	}
	
});

// Delete Class
// Admin / Private Route
// @route DELETE /class/:id
module.exports.cancelClassById = asyncHandler(async (req, res) => {
	const yogaClass = await YogaClass.findById(req.params.id);
	try {
		await YogaClass.deleteOne({ _id: yogaClass._id });
		res.status(200).json({ message: "Class canceled successfully" });
	} catch (err) {
		res.status(400).json({ message: "Class deletion failed" });
	}
});
