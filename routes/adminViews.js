const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')
const moment = require('moment')

router.post('/add', addViews)
router.get('/select', selectViews)
router.get('/selectDetail', selectViewsDetail)

async function addViews(req, res, next) {
  try {
    await mysql.query('INSERT INTO vue_blog_views (routeFrom, routeTo, time, clientSystem, clientBrowser, clientBrowserVersion, clientIp, clientCity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.from, req.body.to, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.system, req.body.browser, req.body.browserVersion, req.body.ip, req.body.city])
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

async function selectViews(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT DATE_FORMAT(time, '%Y-%m-%d') as time, COUNT(*) as views FROM vue_blog_views WHERE DATEDIFF(time, ?) >= 0 AND DATEDIFF(?, time) >= 0 GROUP BY DATE_FORMAT(time, '%Y-%m-%d')",
      [req.query.start, req.query.end])
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

async function selectViewsDetail(req, res, next) {
  try {
    let limitNumber = req.query.limit * 1 || 10
    let offsetNumber = (req.query.page * 1 - 1) * limitNumber
    let selectData = await mysql.query("SELECT routeFrom, routeTo, DATE_FORMAT(time, '%Y-%m-%d %r') as viewTime, clientSystem, clientBrowser, clientBrowserVersion, clientIp, clientCity FROM vue_blog_views WHERE DATEDIFF(time, ?) >= 0 AND DATEDIFF(?, time) >= 0 ORDER BY time DESC LIMIT ? OFFSET ?",
      [req.query.start, req.query.end, limitNumber, offsetNumber])
    let totalData = await mysql.query("SELECT * FROM vue_blog_views WHERE DATEDIFF(time, ?) >= 0 AND DATEDIFF(?, time) >= 0", [req.query.start, req.query.end])
    let allTotalData = await mysql.query("SELECT * FROM vue_blog_views")
    return res.json({
      isok: true,
      data: {
        selectData,
        total: totalData.length,
        allTotal: allTotalData.length
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