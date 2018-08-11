const http = require('http');

module.exports.init = (app) => {
    let port = app.locals.port;
    http.createServer(app).listen(port, error => {
        if (error) throw error
        console.log(`Magic is Happening at here ${port}`);
    });
}
