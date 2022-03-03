const Koa = require('koa')
const koaRouter = require('koa-router')
const static = require('koa-static')
const render = require('koa-art-template')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const path = require('path')

const app = new Koa()
const router = new koaRouter()

const msgs = [
    { username: 'a', content: 'aaaaaa' },
    { username: 'b', content: 'bbbbbbb' },
    { username: 'c', content: 'cccccccccc' }
]

render(app, {
    // 页面查找目录
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
})

app.keys = ['uni_key']

// 再服务器内存中存储   sessionid: 用户数据
let store = {
    myStore: {},
    get: function (key) {
        return this.myStore[key]
    },
    set: function (key, session) {
        this.myStore[key] = session
    },
    destroy: function (key) {
        delete this.myStore[key]
    }
}

router
.get('/', ctx => {
    ctx.render('index')
})
.post('/login', async ctx => {
    let { username, pwd } = ctx.request.body
    ctx.session.user = {
        username
    }

    // 重定向 聊天室
    ctx.redirect('/chat')
})
.get('/chat', async ctx => {
    ctx.render('chat', {
        username: ctx.session.user.username,
        msgs
    })
})
.post('/send', async ctx => {
    let username = ctx.session.user.username
    let content = ctx.request.body.msg

    // 加入消息数组
    msgs.push({ username, content })

    ctx.body = msgs
})

// 请求体数据
app.use(bodyParser())
// 静态资源
app.use(static(path.resolve('./public')))
// session
app.use(session({store}, app))
// 路由
app.use(router.routes())
// 处理 405 501
app.use(router.allowedMethods())

app.listen('2333', () => {
    console.log('listen 2333')
})