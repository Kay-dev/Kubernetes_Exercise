const Koa = require('koa')
const Router = require('@koa/router');
const app = new Koa()
const port = process.env.PORT || 3000;
const router = new Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const imgPath = '/usr/src/app/files/1200.jpg';
const imgUrl = 'https://picsum.photos/1200';

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
        ctx.status = 200;
        ctx.body = `<img src="data:image/jpg;base64,${readImage().toString('base64')}" />`;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error serving image";
        console.error("Error serving image:", error);
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Server started in port ${port}...`)
})
