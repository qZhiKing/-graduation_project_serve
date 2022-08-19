const express = require('express')
const router = express.Router()

const routerHandler = require('../routerHandler/user')
router.post('/reguser', routerHandler.reguser)
router.post('/login', routerHandler.login)
router.post('/forgetpwd', routerHandler.forgetpwd)
module.exports = router