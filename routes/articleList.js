const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.get('/', articleList)

async function articleList(req, res, next) {
  try {
    let limitNumber = req.query.limit * 1 || 10
    let offsetNumber = (req.query.page * 1 - 1) * limitNumber
    let totalData, selectData, totalSql, selectSql
    let selectTableHead = 'articleId, articleTitle, articleSubTitle, articleNature, articleAuthorId, articleCreateTime, articleView, articleStart'
    let orderSql, whereSql
    if (req.query.order == 0) {
      orderSql = `ORDER BY articleCreateTime DESC LIMIT ${limitNumber} OFFSET ${offsetNumber}`
    } else if (req.query.order == 1) {
      orderSql = `ORDER BY articleView DESC LIMIT ${limitNumber} OFFSET ${offsetNumber}`
    } else if (req.query.order == 2) {
      orderSql = `ORDER BY articleStart DESC LIMIT ${limitNumber} OFFSET ${offsetNumber}`
    }
    if (req.query.justOriginal == 'true') {
      let term = 'articleNature = 0'
      whereSql = whereSql ? whereSql + `AND ${term}` : `WHERE ${term}`
    }
    if (req.query.dateTime) {
      let term = `DATE_FORMAT(articleCreateTime, '%Y-%m') = '${req.query.dateTime}'`
      whereSql = whereSql ? whereSql + `AND ${term}` : `WHERE ${term}`
    }
    totalSql = `SELECT * FROM vue_blog ${whereSql}`
    selectSql = `SELECT ${selectTableHead} FROM vue_blog ${whereSql} ${orderSql}`
    totalData = await mysql.query(totalSql)
    selectData = await mysql.query(selectSql)
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