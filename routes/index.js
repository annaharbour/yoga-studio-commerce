const {Router} = require('express')
const userRoutes = require('./userRoutes')

const router = Router()

router.use('/auth', userRoutes)

module.exports = router