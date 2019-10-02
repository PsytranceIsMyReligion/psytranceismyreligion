import nodeStatic from 'node-static';
import https from 'https';
import http from 'http';
import fs from 'fs';
import express from 'express';
import path from "path";
import {
    dirname
} from "path";
import {
    fileURLToPath
} from "url";

const fileServer = new nodeStatic.Server('./images', {
    cache: 3600,
    // headers: { 'X-PsyImage': 'true' }
});

const httpServer = http;
httpServer.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {
            console.log('served file', request.url)
        });
    }).resume();
}).listen(3001, () =>
    console.log("PIMR static-server running on port 3001")
);

/*
This module creates an HTTPS web server and serves static content
from a specified directory on a specified port.
To generate a new cert:
  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
To remove the passphrase requirement:
  openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem
Or just include the "passphrase" option when configuring the HTTPS server.
Sources:
- http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
- https://expressjs.com/en/starter/static-files.html
*/


// const app = express();
// const __dirname = dirname(fileURLToPath(
//     import.meta.url));
// console.log('serve dir, port', __dirname, process.env.SERVER_PORT);

// app.use(express.static(process.env.SERVE_DIRECTORY || 'images'));
// app.get('/', function (req, res) {
//     return res.end('<p>This server serves up static files.</p>');
// });

// const options = {
//     key: fs.readFileSync('./certs/key.pem', 'utf8'),
//     cert: fs.readFileSync('./certs/cert.pem', 'utf8'),
//     passphrase: process.env.HTTPS_PASSPHRASE || 'psytrance'
// };
// const server = https.createServer(options, app);
// console.log('starting secure server on port 3001');
// server.listen(process.env.SERVER_PORT || 3001);