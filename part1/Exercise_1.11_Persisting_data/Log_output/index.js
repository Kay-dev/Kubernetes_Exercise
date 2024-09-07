const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3000;
const router = new Router();

const fs = require('fs');

function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const filePath = '/usr/src/app/files/log.txt';

router.get('/', (ctx) => {
    let time = new Date().toISOString();
    const str = randomString(30);
    let pingpong = "";
    // read file content
    if(fs.existsSync(filePath)) {
        try {
            pingpong = fs.readFileSync(filePath, 'utf8'); // Synchronous file read
        } catch (err) {
            console.log('Error reading file:', err);
        }
    }
    ctx.status = 200;
    console.log("pingpong: " + pingpong);
    ctx.body = `${time}: ${str}\n${pingpong}`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})

