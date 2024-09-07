
const fs = require('fs');

function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const filePath = '/usr/src/app/files/log.txt';
setInterval(() => {
    if(fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                console.log('Error reading file:', err)
            } else {
                const str = randomString(30);
                console.log(data +"/"+ str);
            }
        })
    }
}, 5000);
