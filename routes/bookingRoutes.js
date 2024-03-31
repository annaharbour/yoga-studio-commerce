const { Router } = require('express');
const {getClassBookings, createBooking, cancelBooking}  = require('../controllers/bookingController');
const router = Router();
const {protect, admin} = require('../middleware/authMiddleware')

router.route('/:id').get(protect, getClassBookings).post(protect, createBooking).delete(protect, cancelBooking)

module.exports = router;