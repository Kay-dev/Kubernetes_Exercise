const Koa = require('koa')
const Router = require('@koa/router');
const { Pool } = require('pg');
const app = new Koa()
const port = process.env.PORT || 3001;
const router = new Router();

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
        CREATE TABLE IF NOT EXISTS pingpong_count (
            id SERIAL PRIMARY KEY,
            count INTEGER NOT NULL
        )
        `);
        isDbInitialized = true;
        const result = await client.query('SELECT count FROM pingpong_count WHERE id = 1');
        if (result.rows.length === 0) {
            await client.query('INSERT INTO pingpong_count (id, count) VALUES (1, 0)');
        }
    } catch (err) {
        console.error('Failed to initialize database:', err);
        isDbInitialized = false;
        throw err;
    } finally {
        client.release();
    }
}


router.get('/pingpong', async (ctx) => {
    const client = await pool.connect();
    try {
        await client.query('UPDATE pingpong_count SET count = count + 1 WHERE id = 1');
        const result = await client.query('SELECT count FROM pingpong_count WHERE id = 1');
        ctx.status = 200;
        ctx.body = "Ping / Pongs: " + result.rows[0].count;
    } finally {
        client.release();
    }
});

router.get('/pingpong/pong', async (ctx) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT count FROM pingpong_count WHERE id = 1');
        ctx.status = 200;
        ctx.body = "Pong / Pings: " + result.rows[0].count;
    } finally {
        client.release();
    }
})

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
});


async function startServer() {
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(port, () => {
        console.log(`Server started in port ${port}...`);
    });
    await initializeDatabase();
}

startServer();
