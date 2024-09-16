const Koa = require('koa')
const Router = require('@koa/router');
const { Pool } = require('pg');
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

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

async function initializeDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY ,
            data TEXT NOT NULL
        )
        `);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        throw err;
    } finally {
        client.release();
    }
}


router.get('/', async (ctx) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM todos');
        ctx.status = 200;
        ctx.body = result.rows;
    } finally {
        client.release();
    }
});

router.post('/', async (ctx) => {
    const client = await pool.connect();
    try {
        const { data } = ctx.request.body;
        const result = await client.query('INSERT INTO todos (data) VALUES ($1) RETURNING *', [data]);
        ctx.status = 201;
        ctx.body = result.rows[0];
    } finally {
        client.release();
    }
})


app.use(router.routes()).use(router.allowedMethods());

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(port, () => {
            console.log(`Server started in port ${port}...`);
        });
    } catch(err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

startServer();

