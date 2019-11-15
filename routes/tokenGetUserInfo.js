const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.post('/', tokenGetUserInfo)

async function tokenGetUserInfo(req, res, next) {
  try {
    let selectData = await mysql.query('SELECT * FROM vue_blog_author WHERE token = ?',
      [req.body.token])
    if (selectData.length) {
      return res.json({
        isok: true,
        data: {
          id: selectData[0].authorId,
          name: selectData[0].authorName,
          email: selectData[0].authorEmail,
          admin: selectData[0].admin,
          authority: selectData[0].authority
        },
        msg: ''
      });
    } else {
      return res.json({
        isok: false,
        errorCode: '0000',
        msg: '请重新登录'
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
