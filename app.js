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
const adminViewsRouter = require('./routes/adminViews');
const adminAuthorityRouter = require('./routes/adminAuthority');

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
app.use('/api/vue-blog/getAside', getAsideRouter);
app.use('/api/vue-blog/getAsideAuthor', getAsideAuthorRouter);
app.use('/api/vue-blog/addUser', addUserRouter);
app.use('/api/vue-blog/signIn', signInRouter);
app.use('/api/vue-blog/tokenGetUserInfo', tokenGetUserInfoRouter);
app.use('/api/vue-blog/addArticle', addArticleRouter);
app.use('/api/vue-blog/updateArticle', updateArticleRouter);
app.use('/api/vue-blog/getArticleDetail', getArticleDetailRouter);
app.use('/api/vue-blog/deleteArticle', deleteArticleRouter);
app.use('/api/vue-blog/addStar', addStarRouter);
app.use('/api/vue-blog/images', imagesRouter);
app.use('/api/vue-blog/addUserHeader', addUserHeaderRouter);
app.use('/api/vue-blog/adminUser', adminUserRouter);
app.use('/api/vue-blog/adminViews', adminViewsRouter);
app.use('/api/vue-blog/adminAuthority', adminAuthorityRouter);

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
