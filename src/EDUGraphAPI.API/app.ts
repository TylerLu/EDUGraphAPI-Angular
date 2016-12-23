import http = require('http');
import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import { DbContext } from './data/dbContext';
import cors = require('cors');


import routes = require('./routes/index');
import users = require('./routes/users');
import schools = require('./routes/schools');
import authenticate = require('./routes/authenticate');
import authenticateModule = require('./services/authenticateService');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', routes);
app.post('/authenticate/:action', authenticate);
//app.use('/users', authenticateModule.ValidateLogin, users);
app.use('/users', users);
app.use('/schools', schools);


app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Tyler\n');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err: any, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err: any, req, res, next) {
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//
var db = new DbContext();
db.sync({ force: false }).then(() => { });

var port = process.env.port || 1337
http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
});