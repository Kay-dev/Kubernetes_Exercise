const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3003;
const router = new Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const serve = require('koa-static');
const imgPath = '/usr/src/app/files/1200.jpg';
const imgUrl = 'https://picsum.photos/1200';

app.use(serve(path.join(__dirname, 'public')));

var readImage = () => {
    if (!fs.existsSync(imgPath)) {
        getAndSaveImage();
        return fs.readFileSync(imgPath);
    }
    return fs.readFileSync(imgPath);
}

var getAndSaveImage = () => {
    try {
        axios.get(imgUrl, { responseType: 'stream' })
            .then(response => {
                response.data.pipe(fs.createWriteStream(imgPath));
            });
    } catch (err) {
        console.error("Error while downloading image: ", error);
    }
}

setInterval(getAndSaveImage, 60 * 60 * 1000);

router.get('/', (ctx) => {
    try {
        const imgBase64 = readImage().toString('base64');
        const htmlTemplate = fs.readFileSync(path.join(__dirname, '/index.html'), 'utf8');
        const htmlWithImage = htmlTemplate.replace('{{image}}', imgBase64);
        ctx.status = 200;
        ctx.body = htmlWithImage;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error serving image";
        console.error("Error serving image:", error);
    }
});

router.get('/healthz', (ctx) => {
    ctx.status = 200;
    ctx.body = 'OK';
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})
