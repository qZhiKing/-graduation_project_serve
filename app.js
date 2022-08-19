const express = require('express')
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')
const articleRouter = require('./router/article')
const adminRouter = require('./router/admin')
const cors = require('cors')
const joi = require('@hapi/joi')
const app = express()
const expressJwt = require('express-jwt')
const jwtSecret = require('./config')

app.use('/uploads', express.static('./uploads'))
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

app.use(expressJwt({ secret: jwtSecret.jwtSecret, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

app.use('/api', userRouter)
app.use('/my', userinfoRouter)
app.use('/article', articleRouter)
app.use('/admin', adminRouter)
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('错误的token')
    res.cc(err)
})




app.listen(80, () => {
    console.log('server running at http://127.0.0.1');
})