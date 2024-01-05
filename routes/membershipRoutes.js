const { Router } = require('express');
const {updateMembership, getMembers}  = require('../controllers/membershipController');
const router = Router();
const {protect, admin} = require('../middleware/authMiddleware')


router.post('/:userId', protect, updateMembership);
router.get('/members', protect, admin, getMembers);

module.exports = router;
