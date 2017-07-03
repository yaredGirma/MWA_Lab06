var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var fs=require('fs');
var validator=require('express-validator');
var session=require('express-session');
var csrf=require('csurf');


var index = require('./routes/index');
// var users = require('./routes/users');
var newsletter =require('./routes/newsletter');
// var csrfProtection = 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 's',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 }
}));

// app.use(csrf({cookie:true}));

// Access the session as req.session
app.use(function(req, res, next) {
  var mysession = req.session;
  if(!mysession.email&&req.body.email){
    mysession.email=req.body.email;
  }
 return next();
});


app.use('/newsletter', index);

app.post('/newsletter', newsletter);
app.use('/thankyou',function(req,res,next){  
  res.render('thankyou',{email:req.session.email});
  });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(4000,()=>{console.log("Server is running...")});
module.exports = app;
