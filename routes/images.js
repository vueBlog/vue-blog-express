const express = require('express')
const router = express.Router()
const qiniu = require('qiniu')
const {
  config
} = require('../config.js')

router.get('/add', addImage)

async function addImage(req, res, next) {
  const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
  const options = {
    scope: config.bucket,
    expires: 7200
  }
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  res.json({
    isok: true,
    msg: '上传凭证获取成功',
    upToken: uploadToken
  });
  // next();
}

module.exports = router;