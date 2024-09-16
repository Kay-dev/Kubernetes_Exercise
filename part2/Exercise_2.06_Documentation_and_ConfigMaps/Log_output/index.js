const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3000;
const router = new Router();
const axios = require('axios');

function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

router.get('/', async (ctx) => {
    let time = new Date().toISOString();
    const str = randomString(30);
    // get pong count
    const response = await axios.get('http://pingpong-svc:2346/pingpong/pong')
    let pingpong = response.data;
    ctx.status = 200;
    ctx.body = `file content: this text is from file\nenv variable: MESSAGE=${process.env.MESSAGE}\n${time}: ${str}\n${pingpong}`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})

