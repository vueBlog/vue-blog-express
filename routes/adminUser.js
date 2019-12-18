const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.get('/select', selectUser)
router.post('/update', updateUser)

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

async function updateUser(req, res, next) {
  try {
    await mysql.query('UPDATE vue_blog_author SET authorName = ?, authorIntroduce = ?, authorEmail = ?  WHERE authorId = ?',
      [req.body.name, req.body.introduce, req.body.email, req.body.id])
    return res.json({
      isok: true,
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