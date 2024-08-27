const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3000;

const router = new Router();

router.get('/', (ctx) => {
    ctx.status = 200;
    ctx.body = 'Hello, World!';
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})
