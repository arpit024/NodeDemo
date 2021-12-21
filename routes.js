const express = require('express')
const router = express();
const passport = require('passport')

router.use('/userAuthService',require('./api/userAuthService'))
router.use('/userService', passport.authenticate('verifyToken', { session: false }),require('./api/userService'))
module.exports=router