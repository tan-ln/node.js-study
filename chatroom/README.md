# socket.io
> koa-socket.io + socket.io-client
```html
    <script src="/socket.io/socket.io.js"></script>
    <script>
    var socket = io('http://localhost:2333');
    socket.on('connect', function(){
        console.log('connect on')
    });
    socket.on('message', function(data){
        console.log(data) // :send message from server
    });
    socket.on('disconnect', function(){
        console.log('release connect')
    });
    </script> 
```
```js
io.attach( app )
 
io.on( 'connection', ( context ) => {
  console.log( 'connect on server' )
  io.broadcast('message', 'send message from server')
})
```

## 用户身份验证
socket 协议不通过 http，而是 ws

没有 请求头以及 不会自动携带 cookie

身份
