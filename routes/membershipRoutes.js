const { Router } = require('express');
const {updateMembership}  = require('../controllers/membershipController');
const router = Router();
const {protect, admin} = require('../middleware/authMiddleware')


router.post('/:id', protect, updateMembership);

module.exports = router;
