const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");

const searchRouter = require('./routes/search');
const articleListRouter = require('./routes/articleList');
const asideRouter = require('./routes/aside');
const addUserRouter = require('./routes/addUser');
const signInRouter = require('./routes/signIn');
const tokenGetUserInfoRouter = require('./routes/tokenGetUserInfo');
const articleRouter = require('./routes/article');
const addStarRouter = require('./routes/addStar');
const imagesRouter = require('./routes/images');
const columnRouter = require('./routes/column');
const addUserHeaderRouter = require('./routes/addUserHeader');
const adminUserRouter = require('./routes/adminUser');
const adminViewsRouter = require('./routes/adminViews');
const adminAuthorityRouter = require('./routes/adminAuthority');

// authorityRouter
const authorityRouter = require('./routes/authorityRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/vue-blog/search', searchRouter);
app.use('/api/vue-blog/articleList', articleListRouter);
app.use('/api/vue-blog/aside', asideRouter);
app.use('/api/vue-blog/addUser', addUserRouter);
app.use('/api/vue-blog/signIn', signInRouter);
app.use('/api/vue-blog/tokenGetUserInfo', tokenGetUserInfoRouter);
app.use('/api/vue-blog/article', articleRouter);
app.use('/api/vue-blog/addStar', addStarRouter);
app.use('/api/vue-blog/images', imagesRouter);
app.use('/api/vue-blog/addUserHeader', addUserHeaderRouter);
app.use('/api/vue-blog/adminUser', adminUserRouter);
app.use('/api/vue-blog/views', adminViewsRouter);
app.use('/api/vue-blog/adminAuthority', adminAuthorityRouter);
app.use('/api/vue-blog/column', columnRouter);

// authorityRouter
app.use('/api/authorityRouter', authorityRouter);

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
