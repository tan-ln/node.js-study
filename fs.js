const fs = require('fs')
const path = require('path')

// fs.writeFileSync('./fs/1.txt', 'aaaaaaaaaaa')

// fs.readFileSync('./fs/1.txt', 'utf8', (err, data) => {
//     if(err) throw err
//     console.log(data)    // buffer 
//     // console.log(data.toString('utf8'))
// })

// fs.appendFile('./fs/1.txt', '\n22222222222', (err) => {
//     if (err) throw err
// })

/* 需求：1. 接受命令行参数 2. 读取目录下的文件 3. 输出 （遍历文件夹）*/
const inputPath = path.resolve(process.argv[2])
console.log(inputPath)

try {
    // 存在 ？
    fs.accessSync(inputPath, fs.constants.F_OK)

    let stat = fs.statSync(inputPath)

    if (stat.isFile()) {
        console.log(inputPath)
    } else if (stat.isDirectory()) {
        console.log('文件夹')
        fs.readdir(inputPath, (err, files) => {
            console.log(files)
        })
    }

} catch (e) {
    console.log(e)
    console.log('该文件或文件夹不存在')
}