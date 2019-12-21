const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')
const moment = require('moment')

router.post('/add', addViews)
router.get('/select', selectViews)

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
    let selectData = await mysql.query('SELECT routeFrom, routeTo, time FROM vue_blog_Views ORDER BY time DESC')
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

module.exports = router;