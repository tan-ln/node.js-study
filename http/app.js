const http = require('http')
const fs = require('fs')

const app = http.createServer((req, resp) => {
    if (req.url === '/') {
        fs.readFile('./index.html', (err, data) => {
            resp.writeHead(200, {
                'content-type': 'text/html;charset-utf-8'
            })
            resp.end(data)
        })
    } else if (req.url === '/test') {
        resp.writeHead(200, {
            'content-type': 'application/octet'
        })
        setInterval(function (){
            resp.write('' + Date.now() + '__')
        }, 1000)
    }
}).listen(2333, () => {
    console.log('listen 2333')
})
