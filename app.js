'use strict';

const express = require('express'),
	path = require('path'),
	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	compression = require('compression');
	// request = require('request');

require('dotenv').config();

const network = require('./src/server/modules/network');

const routes = require('./src/server/routes/routes');

// initializing different instances on the server
const app = express();
app.locals.port = 8000;
network.init(app);


app.set('trust proxy', true);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(compression());
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'src/client/public'), {
	maxAge: '750h'
}));

app.use('/', routes);

nunjucks.configure('./src/client/views', {
	autoescape: false,
	express: app
});
app.set('view engine', 'nunjucks');

exports.module = app;
