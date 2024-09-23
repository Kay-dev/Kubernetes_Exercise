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
    const response = await axios.get('http://localhost:3001/pingpong/pong')
    let pingpong = response.data;
    ctx.status = 200;
    ctx.body = `${time}: ${str}\n${pingpong}`;
});

router.get('/healthz', async (ctx) => {
    try {
        // Attempt to connect to the Ping-pong service
        const response = await axios.get('http://localhost:3001/pingpong/pong', { timeout: 5000 });
        if (response.status === 200) {
            ctx.status = 200;
            ctx.body = 'OK';
        } else {
            ctx.status = 500;
            ctx.body = 'Ping-pong service is not responding correctly';
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = 'Unable to connect to Ping-pong service';
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})

