var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//specific requries
var routeManager = require('./routes/manager.js');
var apiRoutes = require('./routes/api.js');
var mvcRoutes = require('./routes/mvc.js');
var config = require('./config.js');

var fileUpload = require('express-fileupload');

var app = express();

//some startup logs to know what's running
console.log(config.projectName);
console.log('PORT', (process.env.PORT || 3000));
console.log('NODE_ENV', app.get('env'));
console.log('siteUrl: ' + config.siteUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//cors enable
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//default express stuff
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.text());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//static folders to make accessible
app.use('/apidocs', express.static(path.join(__dirname, 'apidocs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(fileUpload());

//routes
//MVC
routeManager.register(app, mvcRoutes);
var v1Router = express.Router();
routeManager.register(v1Router, apiRoutes.v1);
app.use('/api/v1', v1Router);
//app.use('/api/v2', v2Router);
app.use('/api', v1Router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'staging') {
  //api specific
  app.use('/api/*', function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {

  //api specific
  app.use('/api/*', function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;