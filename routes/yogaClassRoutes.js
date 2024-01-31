const { Router } = require("express");
const {
	getClasses,
	createClass,
	getClassById,
	updateClassById,
	cancelClassById,
} = require("../controllers/yogaClassController");
const router = Router();
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/class", protect, admin, createClass);
router.get("/", getClasses);
router
	.route("/class/:id")
	.get(getClassById)
	.put(updateClassById)
	.delete(cancelClassById);

module.exports = router;
