const { Router } = require("express");
const {
	createMembershipPlan,
	getMembershipPlans,
	getMembershipPlanById,
	updateMembershipPlan,
	getMembers,
} = require("../controllers/membershipController");
const router = Router();
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/members", protect, admin, getMembers);
router.get("/plans", getMembershipPlans);
router
	.route("/plan/:id")
	.get(getMembershipPlanById)
	.put(protect, admin, updateMembershipPlan);
router.post("/plan", protect, admin, createMembershipPlan);

module.exports = router;
