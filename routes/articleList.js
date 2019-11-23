const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.post('/', articleList)

async function articleList(req, res, next) {
  try {
    let limitNumber = req.body.limit || 10
    let offsetNumber = (req.body.page - 1) * limitNumber
    let totalData
    let selectData
    let totalSql
    let selectSql
    let selectTableHead = 'articleId, articleTitle, articleSubTitle, articleNature, articleAuthorId, articleCreateTime, articleView, articleStart'
    if (req.body.justOriginal) {
      totalSql = 'SELECT * FROM vue_blog WHERE articleNature = 0'
      if (req.body.order === 0) {
        selectSql = `SELECT ${selectTableHead} FROM vue_blog WHERE articleNature = 0 ORDER BY articleCreateTime DESC LIMIT ? OFFSET ?`
      } else if (req.body.order === 1) {
         selectSql = `SELECT ${selectTableHead} FROM vue_blog WHERE articleNature = 0 ORDER BY articleView DESC LIMIT ? OFFSET ?`
      } else if (req.body.order === 2) {
        selectSql = `SELECT ${selectTableHead} FROM vue_blog WHERE articleNature = 0 ORDER BY articleStart DESC LIMIT ? OFFSET ?`
      }
    } else {
      totalSql = 'SELECT * FROM vue_blog'
      if (req.body.order === 0) {
        selectSql = `SELECT ${selectTableHead} FROM vue_blog ORDER BY articleCreateTime DESC LIMIT ? OFFSET ?`
      } else if (req.body.order === 1) {
        selectSql = `SELECT ${selectTableHead} FROM vue_blog ORDER BY articleView DESC LIMIT ? OFFSET ?`
      } else if (req.body.order === 2) {
        selectSql = `SELECT ${selectTableHead} FROM vue_blog ORDER BY articleStart DESC LIMIT ? OFFSET ?`
      }
    }
    totalData = await mysql.query(totalSql)
    selectData = await mysql.query(selectSql,
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