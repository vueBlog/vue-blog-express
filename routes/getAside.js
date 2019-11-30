const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.get('/', getAside)

async function getAside(req, res, next) {
  try {
    let selectData = []
    let selectSqlOne = await mysql.query(`SELECT articleId AS id, articleTitle AS title, articleView AS num FROM vue_blog ORDER BY articleCreateTime DESC LIMIT 5 OFFSET 0`)
    if (selectSqlOne.length) {
      selectData.push({
        title: '最新文章',
        type: 1,
        info: selectSqlOne
      })
    }
    let selectSqlTwo = await mysql.query(`SELECT columnId AS id, columnTitle AS title, columentNumber AS num FROM vue_blog_column ORDER BY columnCreateTime`)
    if (selectSqlTwo.length) {
      selectData.push({
        title: '博客专栏',
        type: 2,
        info: selectSqlTwo
      })
    }
    let selectSqlThree = await mysql.query(`SELECT articleId AS id, articleTitle AS title, articleView AS num FROM vue_blog ORDER BY articleView DESC LIMIT 5 OFFSET 0`)
    if (selectSqlThree.length) {
      selectData.push({
        title: '热门文章',
        type: 3,
        info: selectSqlThree
      })
    }
    let selectSqlFour = await mysql.query(`SELECT DATE_FORMAT(articleCreateTime, '%Y-%m') AS id, COUNT(*) AS num FROM vue_blog GROUP BY DATE_FORMAT(articleCreateTime, '%Y-%m')`)
    if (selectSqlFour.length) {
      selectSqlFour.map(item => {
        item.title = `${item.id.replace('-', '年')}月`
      })
      selectData.push({
        title: '博客归档',
        type: 4,
        info: selectSqlFour
      })
    }
    return res.json({
      isok: true,
      data: {
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