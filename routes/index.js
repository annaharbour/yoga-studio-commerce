const {Router} = require('express')
const userRoutes = require('./userRoutes')
const membershipRoutes = require('./membershipRoutes')

const router = Router()

router.use('/auth', userRoutes)
router.use('/membership', membershipRoutes)
module.exports = router