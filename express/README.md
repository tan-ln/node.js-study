# Express
> 没有封装 ctx?

## app.use('/', (req, resp) => {})
按代码顺序执行

## 中间件
请求与响应之间执行的    函数、处理
### 类别
1. 应用级中间件 (app.use(fn))
2. 路由中间件 (配置路由，app.use(router))
3. 内置中间件 (静态文件的返回。。)
4. 第三方中间件
- cookie\session
- npm
- app.use()
5. 错误处理 (next(err))

## 路由
```js
const router = express.Router

router.get('/', () => {})
.post('/post', () => {})

// 链式调用
```

## req && resp
### resp
1. res.end() 只能响应 String 或读取文件 buffer
2. res.json()   array \ obj （express 封装了 `content-type: application/json; charset=utf-8`）
3. res.send()   Buffer object, a String, an object, or an Array
4. res.redirect(url)  重定向 (302 + header{ Location: url})
5. res.download()
6. res.jsonp()  跨域
```js
url: 127.0.0.1:2333/jsonp?callback=jsonpcallback

app.use('/jsonp', (req, resp) => {
    resp.jsonp('jsonp response')
})

/**/ typeof jsonpcallback === 'function' && jsonpcallback("jsonp response");
```

## 后端渲染 模板引擎
> ejs、art ...
### art-template
`yarn add express-art-template art-template`
```js
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
```
```html
<!-- 语法 -->
<h2>Legends Never Die</h2>
    <ul>
        {{ each legends }}
            <li>{{ $value.name }}</li>
        {{ /each }}
    </ul>
```

## 生产环境 、开发环境、debug 模式
```js
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
})
```
`debug`: 不压缩、不混淆代码、实时更新数据、消耗性能
非 `debug`: 对于*静态内容*不会实时更新、代码压缩合并

## 静态资源 、暴露公共文件
```js
// 静态资源、公共文件向外暴露
const public = require('express').static('./js')
app.use(public)
```

## 文件上传 
`formidable`库
```js
    var form = new formidable.IncomingForm()

    // 上传目录
    form.uploadDir = path.join(__dirname, 'public', 'images')
    // 保存原始扩展名
    form.keepExtensions = true
 
    form.parse(req, function(err, fields, files) {
    //   resp.writeHead(200, {'content-type': 'text/plain'})
    //   resp.write('received upload:\n\n')
        let name = fields.name, 
        avt_file = path.parse(files.avatar.path).base
        resp.redirect('/index')
    })
```