const { Router } = require("express");
const userRoutes = require("./userRoutes");
const membershipRoutes = require("./membershipRoutes");
const bookingRoutes = require("./bookingRoutes");
const yogaClassRoutes = require("./yogaClassRoutes");

const router = Router();

router.use("/users", userRoutes);
router.use("/membership", membershipRoutes);
router.use("/schedule", yogaClassRoutes);
router.use("/booking", bookingRoutes);

module.exports = router;

