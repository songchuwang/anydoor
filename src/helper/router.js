const fs = require('fs');
const path = require('path');
const HandleBars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig'); //使用require可以放心使用相对路径
const mime = require('./mime');
const compress = require('./compress');

const tplPath = path.join(__dirname, '../template/dir.tpl');
// 读取tpl文件，是Buffer形式
const source = fs.readFileSync(tplPath);
// 通过handleBars解析source的字符串形式
const template = HandleBars.compile(source.toString());

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const contentType = mime(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', `${contentType};charset=UTF-8`);
            // 文件通过流的形式读出来，然后一点点吐回给客户端
            let rs = fs.createReadStream(filePath);
            if(filePath.match(config.compress)){
              rs = compress(rs,req,res);
            }
            rs.pipe(res);

        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            // res.end(`${files.join(',')} is directory`);
            const dir = path.relative(config.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            }
            res.end(template(data));
        }
    } catch (ex) {
        console.error(ex);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
        res.end(`${filePath} is not a directory or file \n ${ex.toString()}`);
    }
}