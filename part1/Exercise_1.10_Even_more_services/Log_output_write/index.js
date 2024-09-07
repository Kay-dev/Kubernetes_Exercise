const fs = require('fs');
const path = require('path');

const filePath = "/usr/src/app/files/log.txt";
const dirPath = path.dirname(filePath);

if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

setInterval(() => {
    fs.writeFile(filePath, new Date().toISOString(), (err) => {
        if(err) {
            console.log('Error writting to file:', err)
        } else {
            console.log('File written successfully!');
        }
    })
}, 5000);