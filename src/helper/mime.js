const path = require('path');

const mimeTypes = {
    'css': 'text/css',
    'gif': 'image/gif',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'txt': 'text/plain',
    'xml': 'text/xml'
}

module.exports = (filePath) =>{
    const ext = path.extname(filePath).split('.').pop().toLowerCase();

    if(!ext) {
        ext = filePath;
    }

    return mimeTypes[ext] || mimeTypes['txt']; 
}