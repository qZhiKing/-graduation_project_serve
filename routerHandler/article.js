const db = require('../db')
const path = require('path')
module.exports.paperUpload = (req, res) => {
    const sqlStr = `select * from gtms_file where userID=?`
    db.query(sqlStr, req.user.userID, (err, results) => {
        if (err) return res.cc(err)
        if (results.length != 0) return res.cc('已上传过论文')
        const sqlStr = `insert into gtms_file set ? `
        const articleInfo = {
                userID: req.user.userID,
                file: req.file.filename
            }
            // console.log(articleInfo);
        db.query(sqlStr, articleInfo, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc(err)
            res.cc('提交成功', 0)
        })
    })

}

module.exports.paperChange = (req, res) => {
    const sqlStr = `select * from gtms_file where userID=?`
    db.query(sqlStr, req.user.userID, (err, results) => {
        if (err) return res.cc(err)
        if (results.length != 1) return res.cc('还没有上传过文件')
        const sqlStr = `update gtms_file set file=? where userID=?`
        const articleInfo = {
            userID: req.user.userID,
            file: req.file.filename
        }
        console.log(articleInfo);
        db.query(sqlStr, [articleInfo.file, articleInfo.userID], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc(err)
            res.cc('提交成功', 0)
        })
    })



}

module.exports.updateScore = (req, res) => {
    const sqlStr = 'select * from gtms_student where userID=?'
    db.query(sqlStr, req.body.userID, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) res.cc(err)
        const sqlStr = 'update gtms_student set score=? where userID=?'
        db.query(sqlStr, [req.body.score, req.body.userID], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc(err)
            res.cc('修改成功', 0)
        })
    })
}
module.exports.judge = (req, res) => {
    if (req.user.department != req.params.department) return res.cc('您不是该院系的老师')
    res.cc('您有修改权限', 0)
}

module.exports.download = (req, res) => {
    const sqlStr = `select * from gtms_file where userID=?`
    db.query(sqlStr, req.params.userID, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc('该学生还没有上传论文')
        res.send({
            status: 0,
            message: '获取下载路径成功',
            data: results[0]
        })
    })
}