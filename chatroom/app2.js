const Koa = require('koa')
const koaRouter = require('koa-router')
const static = require('koa-static')
const render = require('koa-art-template')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const IO = require( 'koa-socket' )
const path = require('path')

const app = new Koa()
const router = new koaRouter()
const io = new IO()

const msgs = [
    { username: 'a', content: 'aaaaaa' },
    { username: 'b', content: 'bbbbbbb' },
    { username: 'c', content: 'cccccccccc' }
]

const findById = function (socketid) {
    for (let id in global.mySessionStore) {
        let obj = global.mySessionStore[id]
    
        if (obj.socketid === socketid) {
            return {
                id,
                obj
            }
        }
    }
}

// 保存在内存中的 全局
// 保存有 id(时间戳): {username、socketid}
global.mySessionStore = {}

// socket.io
// 附加到app上 产生关联
io.attach(app)
// 连接开始
io.on( 'connection', ( context ) => {
  console.log( 'connect on server' )

  io.broadcast('message', '广播一个消息 from server')
})
// 处理登录信息
io.on('login', async context => {
    let id = context.data.id
    global.mySessionStore[id].socketid = context.socket.socket.id

    // 用户上线, 所有人 返回用户列表
    io.broadcast('online', {
        online: global.mySessionStore
    })

    context.socket.on('disconnect', context => {
        // console.log('一个用户退出')
        // 删除 id
        let socketid = context.socket.socket.id
        let { id } = findById(socketid)

        delete global.mySessionStore[id]
        // 返回用户列表
        io.broadcast('online', {
            online: global.mySessionStore
        })
    })
})

// 接受客户端消息
io.on('clientMsg', (context, data) => {
    // context.socket (客户端的连接)
    // context.socket.socketId (私聊 id)
    console.log('message from client: ', data.content)

    // 当前的用户对象
    let { obj } = findById(context.socket.socket.id)
    console.log(obj)

    // 广播给所有人
    io.broadcast('everyone', {    
        username: obj.username,
        content: data.content
    })
})

// 私聊 无效
io.on('privateChat', (context) => {
    let { to, msg } = context.data
    console.log(to)
    let from_socketid = context.socket.socket.id

    let { obj } = findById(from_socketid)
    // app._io.to(to).emit('message', `${obj.username}: ${msg}`)
})

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
    // 生成 时间戳 作为 id 响应给客户端 （类似 cookie）
    let id = Date.now()
    ctx.session.user.id = id
    // 存储到内存中
    global.mySessionStore[id] = {
        username
    }

    // 重定向 聊天室
    ctx.redirect('/chatRoom')
})
.get('/chatRoom', async ctx => {
    ctx.render('chatRoom', {
        username: ctx.session.user.username,
        id: ctx.session.user.id,
        msgs
    })
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