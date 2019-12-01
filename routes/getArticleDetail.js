const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.get('/', getAside)

async function getAside(req, res, next) {
  try {
    const articleId = req.query.articleId * 1
    let selectData = await mysql.query(`SELECT * FROM vue_blog WHERE articleId = ?`,
      [articleId])
    let authorInfo = await mysql.query(`SELECT authorId, authorName FROM vue_blog_author WHERE authorId = ?`,
      [selectData[0].articleAuthorId])
    if (req.query.changeView == 1) {
      await mysql.query(`UPDATE vue_blog SET articleView = ? WHERE articleId = ?`,
        [selectData[0].articleView + 1, articleId])
    }
    let articleIdArray = await mysql.query(`SELECT articleId FROM vue_blog`)
    articleIdArray = articleIdArray.map(item => item.articleId)
    let nowIndex = articleIdArray.indexOf(articleId)
    let prevInfo, nextInfo, prevIndex, nextIndex
    if (nowIndex > 0 && nowIndex < articleIdArray.length - 1) {
      prevIndex = nowIndex - 1
      nextIndex = nowIndex + 1
    } else if (nowIndex === 0) {
      prevIndex = articleIdArray.length - 1
      nextIndex = nowIndex + 1
    } else if (nowIndex === articleIdArray.length - 1) {
      prevIndex = nowIndex - 1
      nextIndex = 0
    }
    prevInfo = await mysql.query(`SELECT articleId, articleTitle FROM vue_blog WHERE articleId = ?`,
      [articleIdArray[prevIndex]])
    nextInfo = await mysql.query(`SELECT articleId, articleTitle FROM vue_blog WHERE articleId = ?`,
      [articleIdArray[nextIndex]])
    return res.json({
      isok: true,
      data: {
        info: selectData[0],
        prevInfo: prevInfo.length ? prevInfo[0] : [],
        nextInfo: nextInfo.length ? nextInfo[0] : [],
        authorInfo: authorInfo[0]
      },
      msg: ''
    });
  } catch (error) {
    return res.json({
      isok: false,
      msg: error
    });
  }
  next();
}

module.exports = router;