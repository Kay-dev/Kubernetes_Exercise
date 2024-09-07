// generate random string with length
const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3001;
const router = new Router();
const fs = require('fs');
const path = require('path');

const filePath = "/usr/src/app/files/log.txt";
const dirPath = path.dirname(filePath);

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

let count = 0;
router.get('/pingpong', (ctx) => {
    ctx.status = 200;
    let body = "Ping / Pongs: " + ++count;
    fs.writeFile(filePath, body, (err) => {
        if(err) {
            console.log('Error writting to file:', err)
        } else{
            console.log('File written successfully!');
        }
    })
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})
