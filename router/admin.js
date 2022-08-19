const express = require('express')
const router = express.Router()

const adminHandler = require('../routerHandler/admin')

router.get('/userall/:department/:gender/:pagenum/:pagesize', adminHandler.getAllTeacher)
router.get('/student/activate/:department/:gender/:pagenum/:pagesize', adminHandler.activateStudent)
router.get('/teacher/activate/:department/:gender/:pagenum/:pagesize', adminHandler.activateTeacher)
router.get('/message/:userID', adminHandler.getMessage)
router.post('/delete', adminHandler.delete)
router.post('/activate', adminHandler.activate)
module.exports = router