import nodeStatic from 'node-static';
import http from 'http';
const fileServer = new nodeStatic.Server('./images',  { cache: 3600 });
const httpServer = http;
httpServer.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {
            console.log(e)
        });
    }).resume();
}).listen(3001, () =>
    console.log("PIMR static-server running on port 3001")
);