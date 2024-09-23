const Koa = require('koa')
const Router = require('@koa/router');
const { Pool } = require('pg');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const app = new Koa()
const port = process.env.PORT || 3004;
const router = new Router();

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

let isDbInitialized = false;

async function initializeDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY ,
            data TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
        `);
        isDbInitialized = true;
    } catch (err) {
        console.error('Failed to initialize database:', err);
        isDbInitialized = false;
        throw err;
    } finally {
        client.release();
    }
}



router.get('/api', async (ctx) => {

    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM todos');
        ctx.status = 200;
        ctx.body = result.rows;
    } finally {
        client.release();
    }
});

router.post('/api', async (ctx) => {
    const client = await pool.connect();
    try {
        const { data } = ctx.request.body;
        console.log("request data: ", data);
        if (data === null || data === undefined || data.length === 0) {
            ctx.status = 400;
            console.error("Data is not valid");
            ctx.body = { error: 'Data is not valid' };
            return;
        }
        if (data.length > 140) {
            ctx.status = 400;
            console.error("Data is too long");
            ctx.body = { error: 'Data is too long' };
            return;
        }
        const result = await client.query('INSERT INTO todos (data, done) VALUES ($1, $2) RETURNING *', [data, false]);
        ctx.status = 201;
        ctx.body = result.rows[0];
    } finally {
        client.release();
    }
})

router.put('/api/todos/:id', async (ctx) => {
    const { id } = ctx.params;
    const { done } = ctx.request.body;
    const client = await pool.connect();
    try {
        const result = await client.query('UPDATE todos SET done = $1 WHERE id = $2 RETURNING *', [done, id]);
        ctx.status = 200;
        ctx.body = result.rows[0];
    } finally {
        client.release();
    }
})

// health check
router.get('/healthz', async (ctx) => {
    if (!isDbInitialized) {
        ctx.status = 500;
        ctx.body = 'Database not initialized';
        return;
    }
    const client = await pool.connect();
    try {
        await client.query('SELECT 1');
        ctx.status = 200;
        ctx.body = 'OK';
    } catch (error) {
        console.error('Readiness probe failed:', error);
        ctx.status = 500;
        ctx.body = 'Not ready';
    } finally {
        client.release();
    }
})

app.use(router.routes()).use(router.allowedMethods());

async function startServer() {
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(port, () => {
        console.log(`Server started in port ${port}...`);
    });
    await initializeDatabase();
}

startServer();
