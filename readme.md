# Nodejs
后端语言，服务器中读写文件（IO），V8 引擎

## 内置对象
- 全局对象
- 核心对象：向系统索取，引入使用
- 自定义对象：路径引入

### 全局对象
1. **process** 
- `process.env` 环境变量(path 目录等)
> 环境遍历可以配置唯一属性，来标识不同的 运行环境(开发环境、生产环境。。。)
```js
let uniPath = process.env.UNI_PATH
uniPath ? 'A' : 'B'
```
- `process.argv` 获取命令行参数
```js
console.log(process.argv)

$ node process.js as 12as assss
[
  'D:\\Program Files\\nodejs\\node.exe',
  'd:\\MXJS\\nodejs\\global.js',
  'as',
  '12as',
  'assss'
]
```
> 用来自定义命令(node -v...)

2. **__filename && __dirname**
```bash
d:\MXJS\nodejs\global.js
d:\MXJS\nodejs
```

### 核心对象
> 需引入，require(CommonJS)
1. **path**
- `path.join(__airname, '/a', '//b')` 路径拼接
- `path.resolve('./abc/d.js')` 相对路径转绝对路径 并修正
- `path.parse()`    转为 对象形式
```js
{
  root: 'd:\\',
  dir: 'd:\\MXJS\\nodejs\\a\\b',
  base: 'c.txt',
  ext: '.txt',
  name: 'c'
}
```
- `path.format()` 转回字符串

2. **fs**
- readFile | writeFile (Sync)
```js
const fs = require('fs')

fs.writeFileSync('./fs/1.txt', 'aaaaaaaaaaa', () => {})

fs.readFile('./fs/1.txt', 'utf8', (err, data) => {
    if(err) throw err
    // console.log(data)    // buffer 
    // console.log(data.toString('utf8'))      // aaaaaaaaa
    // 或直接第二个参数 设置
})
```
```bash
# buffer toString 函数转数据
<Buffer 61 61 61 61 61 61 61 61 61 61 61>
```
- appendFile(path, data, callback)

**回调函数作用**：异步、事件循环及消息队列

- stat 文件状态
stat.isFile()
state.isDirrctory()
- readdirs
- access 权限
`fs.access(path, mode, callback)`
> fs.constants.W_OK 写 | fs.constants.R_OK 读 | X_OK 可执行 | F_OK | 存在
```js
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? '不存在' : '存在'}`);
});
```

3. **http**
```js
http.createServer()
server.on('request', (req, resp) => {
    resp.writeHeader(200, {
        data: 'test header'
    })
    resp.write('yingliuzhizhu')
    resp.end('2333')
})

server.listen('2333', () => {
    console.log('listen 23333')
})
```

## https
### 1. 公钥: 公开的加密方式
### 2. 私钥：存在服务器的唯一解公钥加密的方式
### 3. 数字签名，防止内容被篡改
同时发送 加密后的数据 data + ^data&(再加密后) ====== > 服务器，解密 ^data& === data ? 可信 : 被篡改

### 4. 数字证书，保证服务器的可信度，真实域名， 
请求与相应，携带证书，表示发送者的身份
CA 权威机构颁发的证书 （代表某个域名、携带 加密的公钥）
判断证书与当前 请求的服务器域名一致，为可信

启用 https 要携带 证书公钥

## express | koa
1. `koa` 支持 `async await` `promise` 解决异步问题
2. 减少内置中间 `express.static()、express.Router()`，koa 中需要则引入
3. `ctx` 封装了 `request、response`
```js
ctx.request.url() | ctx.url
ctx.response.body() | ctx.body
```

## socket.io
    http: 应用层、无连接、无状态（一问一答）、        数据解析、携带请求头、行、体
    tcp： 传输层、面向连接（三次握手、四次挥手）、    只进行数据传输
    udp： 传输层、无连接（广播）、速度快容易丢包
    ws：将 http 升级到 websocket，但底层还是 tcp

1. 长轮询：客户端不停问、服务器不停回。ajax setInterval
2. 长连接：客户端一次、服务器多次（向客户端单向输出）
3. websocket：全双工、兼容性 IE11
