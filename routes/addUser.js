const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.post('/', addUser)

async function addUser(req, res, next) {
  try {
    let selectData = await mysql.query('SELECT * FROM vue_blog_author')
    let insertData
    // 首个注册的用户拥有管理员权限
    if (selectData.length) {
      let selectNameData = await mysql.query('SELECT * FROM vue_blog_author WHERE authorName = ?', [req.body.name])
      if (selectNameData.length) {
        return res.json({
          isok: false,
          msg: '用户名已存在'
        });
      }
      let selectEmailData = await mysql.query('SELECT * FROM vue_blog_author WHERE authorEmail = ?', [req.body.email])
      if (selectEmailData.length) {
        return res.json({
          isok: false,
          msg: '邮箱已存在'
        });
      }

      insertData = await mysql.query('INSERT INTO vue_blog_author (authorName, authorPassword, authorEmail, admin, authority) VALUES (?, ?, ?, 0, 2)',
        [req.body.name, req.body.password, req.body.email])
    } else {
      insertData = await mysql.query('INSERT INTO vue_blog_author (authorName, authorPassword, authorEmail, admin, authority) VALUES (?, ?, ?, 1, 0)',
        [req.body.name, req.body.password, req.body.email])
    }
    return res.json({
      isok: true,
      data: {
        admin: selectData.length ? false : true
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