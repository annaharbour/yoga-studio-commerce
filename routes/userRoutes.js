const { Router } = require('express');
const {login, signup, logout}  = require('../controllers/userController');
const router = Router();

router.post('/register', signup);
router.post('/login', login);
router.post("/logout", logout);


module.exports = router;
