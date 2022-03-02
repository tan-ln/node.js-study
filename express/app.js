const express = require('express')
const app = express()         // http.createServer()
const router = express.Router()
const formidable = require('formidable')
const path = require('path')

// 静态资源、公共文件向外暴露
const public = express.static('./public')
app.use('/public', public)

app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
})

// 注册渲染引擎 后缀名，引擎
app.engine('.html', require('express-art-template'))
// 配置默认 渲染引擎
app.set('view engine', '.html')

router.get('/legends', (req, resp) => {
    // 文件名 数据对象
    resp.render('legends.html', {
        legends: [{ name: '亚索' }, { name: '锤石' }, { name: '酒桶' }]
    })
})

var member = []

router.get('/index', (req, resp) => {
    resp.render('index.html', {
        member
    })
})

router.post('/add', (req, resp) => {
    var form = new formidable.IncomingForm()

    // 上传目录
    form.uploadDir = path.join(__dirname, 'public', 'images')
    // 保存原始扩展名
    form.keepExtensions = true
 
    form.parse(req, function(err, fields, files) {
    //   resp.writeHead(200, {'content-type': 'text/plain'})
    //   resp.write('received upload:\n\n')
        let name = fields.name, avt_file = path.parse(files.avatar.path).base
        let avt_url = '/public/images/' + avt_file 
        member.push({
            name,
            avatar: avt_url
        })
        resp.redirect('/index')
    //   resp.end(util.inspect({fields: fields, files: files}))
    })

})

// 404
router.all('*', (req, resp) => {
    resp.send('404 Page Not Found')
})

app.use(router)

// 错误处理
app.use((err, req, resp, next) => {
    resp.send('<h2>Error!!!!!!!!!!!!!</h2>')
})

app.listen('2333', () => {
    console.log('listen 2333')
})
