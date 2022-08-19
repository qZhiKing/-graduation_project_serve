const express = require('express')
const router = express.Router()

const userinfoHandler = require('../routerHandler/userinfo')
router.get('/userall/:department/:gender/:pagenum/:pagesize', userinfoHandler.getuserall)
router.get('/userinfo', userinfoHandler.getUserinfo)
router.post('/userinfo', userinfoHandler.updateUserInfo)
router.post('/updatepwd', userinfoHandler.updatePwd)
router.post('/update/avatar', userinfoHandler.updateAvatar)
module.exports = router