const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const searchRouter = require('./routes/search');
const articleListRouter = require('./routes/articleList');
const getAsideRouter = require('./routes/getAside');
const getAsideAuthorRouter = require('./routes/getAsideAuthor');
const addUserRouter = require('./routes/addUser');
const signInRouter = require('./routes/signIn');
const tokenGetUserInfoRouter = require('./routes/tokenGetUserInfo');
const addArticleRouter = require('./routes/addArticle');
const updateArticleRouter = require('./routes/updateArticle');
const getArticleDetailRouter = require('./routes/getArticleDetail');
const deleteArticleRouter = require('./routes/deleteArticle');
const addStarRouter = require('./routes/addStar');
const imagesRouter = require('./routes/images');
const addUserHeaderRouter = require('./routes/addUserHeader');
const adminUserRouter = require('./routes/adminUser');

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

app.use('/api/search', searchRouter);
app.use('/api/articleList', articleListRouter);
app.use('/api/getAside', getAsideRouter);
app.use('/api/getAsideAuthor', getAsideAuthorRouter);
app.use('/api/addUser', addUserRouter);
app.use('/api/signIn', signInRouter);
app.use('/api/tokenGetUserInfo', tokenGetUserInfoRouter);
app.use('/api/addArticle', addArticleRouter);
app.use('/api/updateArticle', updateArticleRouter);
app.use('/api/getArticleDetail', getArticleDetailRouter);
app.use('/api/deleteArticle', deleteArticleRouter);
app.use('/api/addStar', addStarRouter);
app.use('/api/images', imagesRouter);
app.use('/api/addUserHeader', addUserHeaderRouter);
app.use('/api/adminUser', adminUserRouter);

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
