const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.post('/', search)

async function search(req, res, next) {
  try {
    let searchList = []
    let queryString = req.body.queryString
    let articleSelectData = await mysql.query(`SELECT articleId, h0 AS articleTitle FROM vue_blog_title WHERE h0 LIKE '%${queryString}%'`)
    if (articleSelectData.length) {
      articleSelectData.map(item => {
        item.type = 0
      })
    }
    searchList = searchList.concat(articleSelectData)
    for (let i = 1; i <= 6; i++) {
      if (searchList.length < 10) {
        let hTitle = `h${i}`
        let selectData = await mysql.query(`SELECT articleId, h0, ${hTitle} FROM vue_blog_title WHERE ${hTitle} LIKE '%${queryString}%'`)
        for (let j = 0, len = selectData.length; j < len; j ++) {
          selectData[j].type = i
          let nowTitle = selectData[j][hTitle].split(',')
          nowTitle = nowTitle.filter(item => item.indexOf(queryString) > -1)[0]
          selectData[j].articleTitle = `${selectData[j].h0} => ${nowTitle}`
        }
        searchList = searchList.concat(selectData)
      } else {
        break
      }
    }
    
    if (searchList.length) {
      return res.json({
        isok: true,
        data: {
          searchList
        },
        msg: ''
      });
    } else {
      return res.json({
        isok: false,
        msg: '请输入搜索内容'
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

module.exports = router;
