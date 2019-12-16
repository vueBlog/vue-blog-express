const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.get('/select', selectUser)

async function selectUser(req, res, next) {
  try {
    let selectData = await mysql.query('SELECT authorId, authorName, authorHeadimg, authorIntroduce, authorEmail FROM vue_blog_author WHERE authorId = ?',
      [req.query.authorId])
    return res.json({
      isok: true,
      data: {
        userInfo: selectData[0]
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