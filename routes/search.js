const express = require('express')
const router = express.Router()
const mysql = require('./../mysql/db')

router.post('/', search)

async function search(req, res, next) {
  try {
    let searchList = []
    let queryString = req.body.queryString
    // 文章标题
    let articleSelectData = await mysql.query(`SELECT articleId, articleTitle FROM vue_blog WHERE articleTitle LIKE '%${queryString}%'`)
    if (articleSelectData.length) {
      articleSelectData.map(item => {
        item.type = 0
      })
    }
    searchList = searchList.concat(articleSelectData)
    for (let i = 1; i <= 6; i++) {
      if (searchList.length < 10) {
        let hTitle = `h${i}`
        let selectData = await mysql.query(`SELECT articleId, ${hTitle} FROM vue_blog_title WHERE ${hTitle} LIKE '%${queryString}%'`)
        for (let j = 0, len = selectData.length; j < len; j ++) {
          selectData[j].type = i
          let article = await mysql.query(`SELECT articleId, articleTitle FROM vue_blog WHERE articleId = ${selectData[j].articleId}`)
          let nowTitle = selectData[j][hTitle].split(',')
          nowTitle = nowTitle.filter(item => item.indexOf(queryString) > -1)[0]
          selectData[j].articleTitle = `${article[0].articleTitle} => ${nowTitle}`
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
