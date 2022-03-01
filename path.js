const path = require('path')
let p = path.join(__dirname, 'a', 'b', 'c.txt')
let o = path.parse(p)
console.log(o)