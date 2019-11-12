const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.post('/', signIn)

async function signIn(req, res, next) {
  try {
    let selectData = await mysql.query('SELECT * FROM vue_blog_author WHERE authorEmail = ? AND authorPassword = ?', 
      [req.body.email, req.body.password])
    console.log(selectData)
    
    if (selectData.length) {
      if (selectData[0].authority !== 2) {
        return res.json({
          isok: true,
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