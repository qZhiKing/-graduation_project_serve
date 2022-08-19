const { func } = require('@hapi/joi')
const db = require('../db')
const bcrypt = require('bcryptjs')

module.exports.getUserinfo = (req, res) => {
    const userinfo = req.user
    if (userinfo.userID.length == 9) {
        const filed = 'id,userID,username,user_pic,gender,email'
        getUserInfo(filed, 'gtms_admin')
    } else if (userinfo.userID.length == 10) {
        const filed = 'id,userID,username,department,eb,user_pic,gender,email'
        getUserInfo(filed, 'gtms_teacher')
    } else if (userinfo.userID.length == 11) {
        const filed = 'id,userID,username,department,major,papertotal,score,user_pic,gender,email'
        getUserInfo(filed, 'gtms_student')
    }

    function getUserInfo(filed, dt) {
        const sqlStr = `select ${filed} from ${dt} where userID=?`
        db.query(sqlStr, userinfo.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.length != 1) return res.cc('获取用户信息失败')
            res.send({
                status: 0,
                message: '获取用户信息成功',
                data: results[0]
            })
        })
    }
}

module.exports.updateUserInfo = (req, res) => {
    const userinfo = req.body
    if (userinfo.userID.length == 11) {
        updateUserInfo('gtms_student')
    } else if (userinfo.userID.length == 10) {
        updateUserInfo('gtms_teacher')
    } else if (userinfo.userID.length == 9) {
        updateUserInfo('gtms_admin')
    }

    function updateUserInfo(dt) {
        const sqlStr = `update ${dt} set ? where userID=?`
        db.query(sqlStr, [userinfo, userinfo.userID], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows == 0) return res.cc('修改用户信息失败')
            res.cc('修改用户信息成功', 0)
        })
    }
}

module.exports.updatePwd = (req, res) => {

    if (req.user.userID.length == 11) {
        updatePassword('gtms_student')
    } else if (req.user.userID.length == 10) {
        updatePassword('gtms_teacher')
    } else if (req.user.userID.length == 9) {
        updatePassword('gtms_admin')
    }

    function updatePassword(dt) {
        const sqlStr = `select * from ${dt} where id=?`
        db.query(sqlStr, req.user.id, (err, results) => {
            if (err) return res.cc(err)
            if (results.length !== 1) return res.cc('用户不存在')
            const compareFlag = bcrypt.compareSync(req.body.oldPwd, results[0].password)
            if (!compareFlag) return res.cc('原密码错误')
            const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
            const sqlStr = `update ${dt} set password=? where id=?`
            db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc('修改失败')
                res.cc('修改成功', 0)
            })
        })
    }
}

module.exports.updateAvatar = (req, res) => {
    if (req.user.userID.length == 11) {
        updateAvatar('gtms_student')
    } else if (req.user.userID.length == 10) {
        updateAvatar('gtms_teacher')
    } else if (req.user.userID.length == 9) {
        updateAvatar('gtms_admin')
    }

    function updateAvatar(dt) {
        const sqlStr = `update ${dt} set user_pic=? where id=?`
        db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更换头像失败')
            res.cc('更换头像成功', 0)
        })
    }
}

module.exports.getuserall = (req, res) => {
    userinfo = req.params
    let total = 0


    userinfo.pagenum = (userinfo.pagenum - 1) * userinfo.pagesize
    if (userinfo.department == '所有' && userinfo.gender == '所有') {
        const filed = []
        const sqlStr = `select * from gtms_student where is_delete=0 `
        db.query(sqlStr, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        getuser(filed, `where is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize}`)
    } else if (userinfo.department == '所有') {
        const sqlStr = `select * from gtms_student where is_delete=0 and gender=?`
        const filed = [req.params.gender]
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where gender=? and is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize}`
        getuser(filed, filedStr)
    } else if (userinfo.gender == '所有') {
        const filed = [req.params.department]
        const sqlStr = `select * from gtms_student where is_delete=0 and department=? `
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where department=? and is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize} `
        getuser(filed, filedStr)
    } else {
        const filed = [req.params.department, req.params.gender]
        const sqlStr = `select * from gtms_student where is_delete=0 and department=? and gender=? `
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where department=? and gender=? and is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize}`
        getuser(filed, filedStr)
    }

    function getuser(filed, filedStr) {
        const sqlStr = `select * from gtms_student ${filedStr}`
        db.query(sqlStr, filed, (err, resluts) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '成功',
                data: resluts,
                total
            })
        })
    }
}