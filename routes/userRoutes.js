const { Router } = require('express');
const {login, signup, logout, getUser, getUsers, updateUser, deleteUser, createUserMembership, cancelMembership}  = require('../controllers/userController');
const router = Router();
const {protect, admin} = require('../middleware/authMiddleware')

router.post('/register', signup);
router.post('/login', login);
router.post("/logout", logout);
router.get('/users', protect, admin, getUsers)
router.route("/:id").get(protect, getUser).put(protect, admin, updateUser).delete(protect, admin, deleteUser)
router.route('/membership/:id').post(protect, createUserMembership).delete(protect, cancelMembership)

module.exports = router;
