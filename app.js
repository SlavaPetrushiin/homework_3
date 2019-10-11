const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const multer  = require("multer");
const session = require('express-session');
const flash = require('connect-flash');

const storage = multer.diskStorage({
	destination : ( req, file, cb ) =>{
		cb(null, "public/images/products");
	},
	filename: (req, file, cb) =>{
		cb(null, file.originalname);
	}	
})

const upload = multer({
	storage : storage,
	limits: {fieldSize: 2 * 1024 * 1024},
})

global.UPLOAD = upload;

require('./database');
require('./engine');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret key'));
app.use(session({ cookie: { maxAge: 3600 * 24 } }));
app.use(flash());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


