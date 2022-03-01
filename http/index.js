const http = require('http')

const server = http.createServer()

server.on('request', (req, resp) => {
    resp.writeHeader(200, {
        data: 'test header'
    })
    resp.write('yingliuzhizhu')
    resp.end('2333')    // yidingyao end
})

server.listen('2333', () => {
    console.log('listen 23333')
})