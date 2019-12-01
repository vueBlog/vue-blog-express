const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.post('/', addStar)

async function addStar(req, res, next) {
  try {
    let articleId = req.body.articleId * 1
    let selectData = await mysql.query(`SELECT articleStart FROM vue_blog WHERE articleId = ?`,
      [articleId])
    let articleStart = selectData[0].articleStart + 1
    await mysql.query(`UPDATE vue_blog SET articleStart = ? WHERE articleId = ?`,
      [articleStart, articleId])
    return res.json({
      isok: true,
      data: {
        articleStart
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