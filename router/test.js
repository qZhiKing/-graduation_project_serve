const express = require('express')
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const router = express.Router();
const picHandler = require('../router_handler/picAdd')


// 定制上传控件
var storage = multer.diskStorage({
    // 定义上传文件的存放路径
    destination: path.join(__dirname, '../picUpload'),
    // 定义上传图片,图片的存储规则
    filename: function(req, file, cb) {
        let fileFormat = (file.originalname).split('.') // 取后缀
            // 设置保存时的文件名，uuid + 后缀
        cb(null, uuid.v1() + '.' + fileFormat[fileFormat.length - 1])
    }
})

// 定义上传图片存放路径
var picUpload = multer({
    storage,
})

// 添加图片的路由
router.post('/addPic', picUpload.single('pic_img'), picHandler.addPic)
    // 获取全部图片的路由
router.get("/getPic", picHandler.getPic)
    // 删除图片的路由
router.get("/delPic/:id", picHandler.delPic)
module.exports = router