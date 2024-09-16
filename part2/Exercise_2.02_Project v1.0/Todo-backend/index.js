const Koa = require('koa')
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const app = new Koa()
const port = process.env.PORT || 3004;

const router = new Router({
    prefix: '/api'
});

app.use(bodyParser());
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    exposeHeaders: ['Content-Length', 'Content-Type', 'Content-Disposition'],
}));

const todos = [];

router.get('/', (ctx) => {
    ctx.status = 200;
    ctx.body = todos;
});

router.post('/', (ctx) => {
    ctx.status = 200;
    const {data} = ctx.request.body;
    todos.push(data);
    ctx.body = {data};
})


app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})
