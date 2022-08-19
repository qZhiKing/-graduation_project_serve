const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../config')

module.exports.reguser = (req, res) => {
    const userinfo = req.body
    if (userinfo.userID.length == 11) {
        regUser('gtms_student')
    } else if (userinfo.userID.length == 10) {
        regUser('gtms_teacher')
    } else {
        if (userinfo.userID != '201738211') {
            return res.cc('错误的管理员账号')
        }
        regUser('gtms_admin')
    }

    function regUser(dt) {
        const sqlStr = `select * from ${dt} where userID=?`
        db.query(sqlStr, userinfo.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.length != 0) return res.cc('用户名已被注册')
            userinfo.password = bcrypt.hashSync(userinfo.password, 10)
            const sqlStr = `insert into ${dt} set?`
            db.query(sqlStr, userinfo, (err, results) => {
                if (err) return res.cc(err)
                res.send({
                    status: 0,
                    message: '注册成功'
                })
            })
        })
    }
}

module.exports.login = (req, res) => {
    const userinfo = req.body
    if (userinfo.userID.length == 11) {
        loginUser('gtms_student')
    } else if (userinfo.userID.length == 10) {
        loginUser('gtms_teacher')
    } else {
        loginUser('gtms_admin')
    }

    function loginUser(dt) {
        const sqlStr = `select * from ${dt} where userID=? and is_delete=0`
        db.query(sqlStr, userinfo.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.length != 1) return res.cc('登录失败')
            const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
            if (!compareResult) return res.cc('登录失败')
            const user = {...results[0], password: '', user_pic: '' }
            const tokenStr = jwt.sign(user, jwtSecret.jwtSecret, { expiresIn: '10h' })

            res.send({
                status: 0,
                message: '登录成功',
                tokenStr: `Bearer ${tokenStr}`
            })
        })
    }
}

module.exports.forgetpwd = (req, res) => {
    const userinfo = req.body
    if (userinfo.userID.length == 11) {
        forgetpwd('gtms_student')
    } else if (userinfo.userID.length == 10) {
        forgetpwd('gtms_teacher')
    } else {
        forgetpwd('gtms_admin')
    }

    function forgetpwd(dt) {
        const sqlStr = `select * from ${dt} where userID=? and is_delete=0`
        db.query(sqlStr, userinfo.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.length !== 1) return res.cc('用户不存在！或账号需要激活')
            const sqlStr = `update ${dt} set password=? where userID=? and email=?`
            const newPwd = bcrypt.hashSync(userinfo.newPwd, 10)
            db.query(sqlStr, [newPwd, userinfo.userID, userinfo.email], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows == 0) return res.cc('更改密码失败')
                res.send({
                    status: 0,
                    message: '更改密码成功'
                })
            })
        })
    }

}