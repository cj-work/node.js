//
// 注意： index.js中代码的先后顺序非常重要
//
//
const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const winston = require('winston')
const expressWinston = require('express-winston')

const app = express()

// 设置模版目录
app.set('views', path.join(__dirname, 'views'))
// 设置模版引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// session中间件
app.use(session({
    // 设置cookie中保存session id的字段名称
    name : config.session.key,           
    // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    secret : config.session.secret,      
    // 强制更新sessio
    resave : true,  
    // 设置为 false，强制创建一个session，即使用户未登录
    saveUninitialized : false,
    cookie : {
        // 过期时间，过期后 cookie 中的 session id 自动删除
        maxAge : config.session.maxAge
    },
    // 将 session 存储到 mongodb
    store : new MongoStore({
        // mongodb地址
        url : config.mongodb
    })
}));

// flash 中间件，用来显示通知
app.use(flash())

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    // 上传文件目录
    uploadDir: path.join(__dirname, 'public/img'),
    // 保留后缀
    keepExtensions: true
}))

// 设置模版全局常量
app.locals.blog = {
    title : pkg.name,
    description : pkg.description
}

// // 添加模板必需的三个变量
app.use(function(req, res, next){
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString() 
    res.locals.error = req.flash('error').toString() 
    next()
})

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))

// 路由
routes(app)

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}))

// 错误页面
app.use(function(err, req, res, next){
    console.error(err)
    req.flash('error', err.message)
    res.redirect('/posts')
})

//
// TODO: 启动程序前需要先启动mongodb,后期需要使用脚本启动
//
// 监听端口，启动程序
app.listen(config.port, function(){
    console.log(`${pkg.name} listening on port ${config.port}`)
})