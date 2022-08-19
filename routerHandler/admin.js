const { func } = require("@hapi/joi")
const db = require("../db")


module.exports.getAllTeacher = (req, res) => {
    userinfo = req.params
    let total = 0
    userinfo.pagenum = (userinfo.pagenum - 1) * userinfo.pagesize
    if (userinfo.department == '所有' && userinfo.gender == '所有') {
        const filed = []
        const sqlStr = `select * from gtms_teacher where is_delete=0 `
        db.query(sqlStr, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        getuser(filed, `where is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize}`)
    } else if (userinfo.department == '所有') {
        const sqlStr = `select * from gtms_teacher where is_delete=0 and gender=?`
        const filed = [req.params.gender]
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where gender=? and is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize}`
        getuser(filed, filedStr)
    } else if (userinfo.gender == '所有') {
        const filed = [req.params.department]
        const sqlStr = `select * from gtms_teacher where is_delete=0 and department=? `
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where department=? and is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize} `
        getuser(filed, filedStr)
    } else {
        const filed = [req.params.department, req.params.gender]
        const sqlStr = `select * from gtms_teacher where is_delete=0 and department=? and gender=? `
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where department=? and gender=? and is_delete=0 limit ${userinfo.pagenum} , ${userinfo.pagesize}`
        getuser(filed, filedStr)
    }

    function getuser(filed, filedStr) {
        const sqlStr = `select * from gtms_teacher ${filedStr}`
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
module.exports.activateStudent = (req, res) => {
    userinfo = req.params
    let total = 0
    userinfo.pagenum = (userinfo.pagenum - 1) * userinfo.pagesize
    if (userinfo.department == '所有' && userinfo.gender == '所有') {
        const filed = []
        const sqlStr = `select * from gtms_student where is_delete=1 `
        db.query(sqlStr, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        getuser(filed, `where is_delete=1 limit ${userinfo.pagenum} , ${userinfo.pagesize}`)
    } else if (userinfo.department == '所有') {
        const sqlStr = `select * from gtms_student where is_delete=1 and gender=?`
        const filed = [req.params.gender]
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where gender=? and is_delete=1 limit ${userinfo.pagenum} , ${userinfo.pagesize}`
        getuser(filed, filedStr)
    } else if (userinfo.gender == '所有') {
        const filed = [req.params.department]
        const sqlStr = `select * from gtms_student where is_delete=1 and department=? `
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where department=? and is_delete=1 limit ${userinfo.pagenum} , ${userinfo.pagesize} `
        getuser(filed, filedStr)
    } else {
        const filed = [req.params.department, req.params.gender]
        const sqlStr = `select * from gtms_student where is_delete=1 and department=? and gender=? `
        db.query(sqlStr, filed, (err, results) => {
            if (err) return res.cc(err)
            total = results.length
        })
        const filedStr = `where department=? and gender=? and is_delete=1 limit ${userinfo.pagenum} , ${userinfo.pagesize}`
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
module.exports.activateTeacher = (req, res) => {
    activate_user('gtms_teacher', 1)

    function activate_user(dt, flag) {
        userinfo = req.params
        let total = 0
        userinfo.pagenum = (userinfo.pagenum - 1) * userinfo.pagesize
        if (userinfo.department == '所有' && userinfo.gender == '所有') {
            const filed = []
            const sqlStr = `select * from ${dt} where is_delete=${flag} `
            db.query(sqlStr, (err, results) => {
                if (err) return res.cc(err)
                total = results.length
            })
            getuser(filed, `where is_delete=${flag} limit ${userinfo.pagenum} , ${userinfo.pagesize}`)
        } else if (userinfo.department == '所有') {
            const sqlStr = `select * from ${dt} where is_delete=${flag} and gender=?`
            const filed = [req.params.gender]
            db.query(sqlStr, filed, (err, results) => {
                if (err) return res.cc(err)
                total = results.length
            })
            const filedStr = `where gender=? and is_delete=${flag} limit ${userinfo.pagenum} , ${userinfo.pagesize}`
            getuser(filed, filedStr)
        } else if (userinfo.gender == '所有') {
            const filed = [req.params.department]
            const sqlStr = `select * from ${dt} where is_delete=${flag} and department=? `
            db.query(sqlStr, filed, (err, results) => {
                if (err) return res.cc(err)
                total = results.length
            })
            const filedStr = `where department=? and is_delete=${flag} limit ${userinfo.pagenum} , ${userinfo.pagesize} `
            getuser(filed, filedStr)
        } else {
            const filed = [req.params.department, req.params.gender]
            const sqlStr = `select * from ${dt} where is_delete=${flag} and department=? and gender=? `
            db.query(sqlStr, filed, (err, results) => {
                if (err) return res.cc(err)
                total = results.length
            })
            const filedStr = `where department=? and gender=? and is_delete=${flag} limit ${userinfo.pagenum} , ${userinfo.pagesize}`
            getuser(filed, filedStr)
        }

        function getuser(filed, filedStr) {
            const sqlStr = `select * from ${dt} ${filedStr}`
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
}
module.exports.getMessage = (req, res) => {
    if (req.params.userID.length == 11) {
        getMsg('gtms_student')
    } else {
        getMsg('gtms_teacher')

    }

    function getMsg(dt) {
        const sqlStr = `select * from ${dt} where userID=?`
        db.query(sqlStr, req.params.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.length !== 1) return res.cc('不存在此用户')
            res.send({
                status: 0,
                message: '获取成功',
                data: results[0]
            })
        })
    }
}
module.exports.delete = (req, res) => {
    if (req.body.userID.length == 11) {
        deleteUser('gtms_student')
    } else if (req.body.userID.length == 10) {
        deleteUser('gtms_teacher')
    }

    function deleteUser(dt) {
        const sqlStr = `update ${dt} set is_delete=1 where userID=?`
        db.query(sqlStr, req.body.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows != 1) return res.cc('删除失败')
            res.cc('删除成功', 0)
        })
    }
}
module.exports.activate = (req, res) => {
    if (req.body.userID.length == 11) {
        deleteUser('gtms_student')
    } else if (req.body.userID.length == 10) {
        deleteUser('gtms_teacher')
    }

    function deleteUser(dt) {
        const sqlStr = `update ${dt} set is_delete=0 where userID=?`
        db.query(sqlStr, req.body.userID, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows != 1) return res.cc('激活失败')
            res.cc('激活成功', 0)
        })
    }
}