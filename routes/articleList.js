const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.post('/', articleList)

async function articleList(req, res, next) {
  try {
    let limitNumber = req.body.limit || 10
    let offsetNumber = (req.body.page - 1) * limitNumber
    let orderType = req.body.order || 'ASC'

    let totalData = await mysql.query('SELECT * FROM vue_blog')
    let selectData = await mysql.query('SELECT * FROM vue_blog ORDER BY articleCreateTime DESC LIMIT ? OFFSET ?',
      [limitNumber, offsetNumber])
    return res.json({
      isok: true,
      data: {
        total: totalData.length,
        list: selectData
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