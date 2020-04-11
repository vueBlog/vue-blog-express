const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')
const qiniu = require('qiniu')
const {
  config
} = require('../config.js')

router.get('/getToken', getToken)
router.get('/list', adList)
router.post('/add', adAdd)
router.get('/detail', adDetail)
router.post('/delete', adDelete)
router.post('/changeSort', adChangeSort)

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

async function adList(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT adId, adName, adUrl, adSort, adPcImg, adMImg FROM vue_blog_ad ORDER BY adSort")
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

async function adAdd(req, res, next) {
  try {
    if (req.body.id) {
      await mysql.query('UPDATE vue_blog_ad SET adName = ?, adUrl = ?, adPcImg = ?, adMImg = ? WHERE adId = ?',
        [req.body.name, req.body.url, req.body.pcImg, req.body.mImg, req.body.id])
    } else {
      let adList = await mysql.query("SELECT adId, adName, adUrl, adSort FROM vue_blog_ad ORDER BY adSort")
      let sort = adList.length ? adList[adList.length - 1].adSort * 1 + 1 : 1
      await mysql.query('INSERT INTO vue_blog_ad (adName, adUrl, adPcImg, adMImg, adSort) VALUES (?, ?, ?, ?, ?)',
        [req.body.name, req.body.url, req.body.pcImg, req.body.mImg, sort])
    }
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
}

async function adDetail(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT adId, adName, adUrl, adPcImg, adMImg FROM vue_blog_ad WHERE adId = ?",
    [req.query.id])
    return res.json({
      isok: true,
      data: selectData[0],
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

async function adDelete(req, res, next) {
  try {
    await mysql.query('DELETE FROM vue_blog_ad WHERE adId = ?',
      [req.body.id])
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

async function adChangeSort(req, res, next) {
  try {
    if (req.body.list.length) {
      for (let i = 0, len = req.body.list.length; i < len; i++) {
        await mysql.query("UPDATE vue_blog_ad SET adSort = ? WHERE adId = ?",
          [req.body.list[i].adSort, req.body.list[i].adId])
      }
    }
    return res.json({
      isok: true,
      msg: '更新成功'
    });
  } catch (error) {
    return res.json({
      isok: false,
      msg: error
    });
  }
}

module.exports = router;