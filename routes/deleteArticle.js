const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.post('/', deleteArticle)

async function deleteArticle(req, res, next) {
  try {
    let selectArticleInfo = await mysql.query('SELECT articleAuthorId FROM vue_blog WHERE articleId = ?', [req.body.articleId])
    let selectUserInfo = await mysql.query('SELECT authority FROM vue_blog_author WHERE authorId = ?', [req.body.userId])
    if (selectUserInfo[0].authority == 0 || selectArticleInfo[0].articleAuthorId == req.body.userId) {
      let deleteArticleInfo = await mysql.query('DELETE FROM vue_blog WHERE articleId = ?', [req.body.articleId])
      return res.json({
        isok: true,
        msg: ''
      });
    } else {
      return res.json({
        isok: false,
        msg: '无权限操作'
      });
    }
  } catch (error) {
    return res.json({
      isok: false,
      msg: error
    });
  }
  next();
}

module.exports = router;