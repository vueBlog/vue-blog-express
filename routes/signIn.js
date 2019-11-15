const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')
const md5 = require("blueimp-md5")

router.post('/', signIn)

async function signIn(req, res, next) {
  try {
    let selectData = await mysql.query('SELECT * FROM vue_blog_author WHERE authorEmail = ? AND authorPassword = ?', 
      [req.body.email, req.body.password])
    let token = md5(Date.now() + req.body.email + req.body.password)
    let updataData = await mysql.query('UPDATE vue_blog_author SET token = ? WHERE  authorEmail = ? AND authorPassword = ?',
      [token, req.body.email, req.body.password])
    if (selectData.length) {
      if (selectData[0].authority !== 2) {
        return res.json({
          isok: true,
          data: {
            token
          },
          msg: '登录成功'
        });
      } else {
        return res.json({
          isok: false,
          msg: '等待管理员审核'
        });
      }
    } else {
      return res.json({
        isok: false,
        msg: '用户信息有误'
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