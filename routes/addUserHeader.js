const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')
const qiniu = require('qiniu')
const {
  config
} = require('../config.js')

router.get('/getToken', getToken)
router.post('/add', addImage)

async function getToken(req, res, next) {
  const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
  const options = {
    scope: `${config.bucket}`,
    expires: 7200
  }
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  res.json({
    isok: true,
    msg: '上传凭证获取成功',
    upToken: uploadToken
  });
}

async function addImage(req, res, next) {
  try {
    let imgPath = req.body.headerPath
    await mysql.query('UPDATE vue_blog_author SET authorHeadimg = ? WHERE authorId = ?',
      [imgPath, req.body.id]);
    return res.json({
      isok: true,
      msg: '',
      data: {}
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