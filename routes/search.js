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
          selectData[j][hTitle] = nowTitle
          selectData[j].articleTitle = `${selectData[j].h0} => ${nowTitle}`
        }
        searchList = searchList.concat(selectData)
      } else {
        break
      }
    }
    if (searchList.length < 10) {
      let keySelectData = await mysql.query(`SELECT articleId, articleTitle, articleKey FROM vue_blog WHERE articleKey LIKE '%${queryString}%'`)
      for (let j = 0, len = keySelectData.length; j < len; j++) {
        keySelectData[j].type = 7
        let nowKey = keySelectData[j].articleKey ? keySelectData[j].articleKey.split(',') : []
        nowKey = nowKey.filter(item => item.indexOf(queryString) > -1)[0]
        keySelectData[j].articleTitle = `${keySelectData[j].articleTitle} => ${nowKey}`
      }
      searchList = searchList.concat(keySelectData)
    }
    
    if (searchList.length) {
      if (searchList.length > 10) searchList.length = 10
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
