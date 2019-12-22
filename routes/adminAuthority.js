const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.get('/select', selectUser)
router.post('/update', updateUser)

async function selectUser(req, res, next) {
  try {
    let seleteIdAuthority = await mysql.query('SELECT authority FROM vue_blog_author WHERE authorId = ?', [req.query.id])
    if (seleteIdAuthority[0].authority !== 0) {
      return res.json({
        isok: false,
        msg: '无权访问'
      });
    }
    let selectData = await mysql.query('SELECT authorId, authorName, authorEmail, authority FROM vue_blog_author')
    return res.json({
      isok: true,
      data: selectData,
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
    await mysql.query('UPDATE vue_blog_author SET authority = ?  WHERE authorId = ?',
      [req.body.authority, req.body.id])
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