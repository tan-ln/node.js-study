# Koa

## 中间件
koa 中间件洋葱模型

use 方法从外到内装载中间件

中间件是一个 回调函数，接受两个参数 ctx 和 next
- ctx 是 koa 对 nodejs 原生接口 req res 的封装
- next 是在完成当前业务后，调用下一个中间件
```js
app.use((ctx, next) => {
  console.log('进入第一个中间件')
  next()
  console.log('离开第一个中间件')
})
app.use((ctx, next) => {
  console.log('进入第二个中间件')
  next()
  console.log('离开第二个中间件')
})
app.use((ctx, next) => {
  console.log('进入第三个中间件')
  next()
  console.log('离开第三个中间件')
})
```
```
进入第一个中间件
进入第二个中间件
进入第三个中间件
离开第三个中间件
离开第二个中间件
离开第一个中间件
```

middleware[] 收集 中间件函数回调函数
通过判断下标 i，dispatch() 调用函数执行，i++