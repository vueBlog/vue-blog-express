const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')
const moment = require('moment')

router.post('/editor', columnEditor)
router.get('/list', columnList)
router.post('/delete', columnDelete)
router.get('/detail', columnDetail)
router.get('/articleList', columnArticle)
router.post('/articleSet', columnArticleSet)
router.get('/articleAllList', columnArticleAllList)

async function columnEditor(req, res, next) {
  try {
    if (req.body.id) {
      await mysql.query('UPDATE vue_blog_column SET columnTitle = ?, columnContent = ? WHERE columnId = ?',
        [req.body.name, req.body.desc, req.body.id])
    } else {
      await mysql.query('INSERT INTO vue_blog_column (columnTitle, columnContent, columnCreateTime) VALUES (?, ?, ?)',
        [req.body.name, req.body.desc, moment().format('YYYY-MM-DD HH:mm:ss')])
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
  next();
}

async function columnList(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT columnId, columnTitle, columnContent, columnNumber, DATE_FORMAT(columnCreateTime, '%Y-%m-%d %r') as time FROM vue_blog_column")
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

async function columnDelete(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT columnNumber FROM vue_blog_column WHERE columnId = ?",
      [req.body.id])
    if (selectData[0].columnNumber) {
      return res.json({
        isok: false,
        msg: '请先将该专栏下的文章移出！'
      });
    } else {
      await mysql.query('DELETE FROM vue_blog_column WHERE columnId = ?',
        [req.body.id])
      return res.json({
        isok: true,
        msg: ''
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

async function columnDetail(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT columnId, columnTitle, columnContent, columnNumber, DATE_FORMAT(columnCreateTime, '%Y-%m-%d %r') as time FROM vue_blog_column WHERE columnId = ?",
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

async function columnArticle(req, res, next) {
  try {
    let limitNumber = req.query.limit * 1 || 10
    let offsetNumber = (req.query.page * 1 - 1) * limitNumber
    let selectData = await mysql.query("SELECT articleId, articleTitle FROM vue_blog WHERE articleColumn = ? ORDER BY articleCreateTime DESC LIMIT ? OFFSET ?",
      [req.query.id, limitNumber, offsetNumber])
    let totalSelectData = await mysql.query("SELECT articleId, articleTitle FROM vue_blog WHERE articleColumn = ? ORDER BY articleCreateTime DESC",
      [req.query.id])
    await mysql.query('UPDATE vue_blog_column SET columnNumber = ? WHERE columnId = ?',
      [totalSelectData.length, req.query.id])
    return res.json({
      isok: true,
      data: {
        selectData,
        total: totalSelectData.length
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

async function columnArticleSet(req, res, next) {
  try {
    for (let i = 0, len = req.body.id.length; i < len; i++) {
      await mysql.query("UPDATE vue_blog SET articleColumn = ? WHERE articleId = ?",
        [req.body.type == 'delete' ? -1 : req.body.columnId, req.body.id[i] * 1])
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
  next();
}

async function columnArticleAllList(req, res, next) {
  try {
    let selectData = await mysql.query("SELECT articleId, articleTitle FROM vue_blog WHERE articleColumn = -1 OR articleColumn = 0  OR articleColumn = ? ORDER BY articleCreateTime",
      [req.query.id])
    return res.json({
      isok: true,
      data: {
        selectData
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