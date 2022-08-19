const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const uuid = require('uuid')

const articleHandler = require('../routerHandler/article')

// 定制上传控件
var storage = multer.diskStorage({
    // 定义上传文件的存放路径
    destination: path.join(__dirname, '../uploads'),
    // 定义上传图片,图片的存储规则
    filename: function(req, file, cb) {
        let fileFormat = (file.originalname).split('.') // 取后缀
            // 设置保存时的文件名，uuid + 后缀
        cb(null, uuid.v1() + '.' + fileFormat[fileFormat.length - 1])
    }
})

// 定义上传图片存放路径
var docUpload = multer({
        storage,
    })
    // const upload = multer({ dest: path.join(__dirname, '../uploads') })

router.post('/student/paperupload', docUpload.single('file'), articleHandler.paperUpload)
router.post('/student/paperchange', docUpload.single('file'), articleHandler.paperChange)

router.post('/update/score', articleHandler.updateScore)
router.get('/judge/:department', articleHandler.judge)

router.get('/download/:userID', articleHandler.download)
module.exports = router