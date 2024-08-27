// generate random string with length
const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3001;
const router = new Router();

let count = 0;
router.get('/pingpong', (ctx) => {
    ctx.status = 200;
    ctx.body = "pong " + ++count;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})
