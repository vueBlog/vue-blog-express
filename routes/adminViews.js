const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')
const moment = require('moment')

router.post('/add', addViews)
router.get('/select', selectViews)
router.get('/selectDetail', selectViewsDetail)

async function addViews(req, res, next) {
  try {
    await mysql.query('INSERT INTO vue_blog_views (routeFrom, routeTo, time) VALUES (?, ?, ?)',
      [req.body.from, req.body.to, moment().format('YYYY-MM-DD HH:mm:ss')])
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
    let selectData = await mysql.query("SELECT routeFrom, routeTo, DATE_FORMAT(time, '%Y-%m-%d %r') as time FROM vue_blog_views WHERE DATEDIFF(time, ?) >= 0 AND DATEDIFF(?, time) >= 0 ORDER BY time DESC LIMIT ? OFFSET ?",
      [req.query.start, req.query.end, limitNumber, offsetNumber])
    let totalData = await mysql.query("SELECT * FROM vue_blog_views WHERE DATEDIFF(time, ?) >= 0 AND DATEDIFF(?, time) >= 0", [req.query.start, req.query.end])
    return res.json({
      isok: true,
      data: {
        selectData,
        total: totalData.length
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