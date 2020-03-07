const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')

router.get('/', getAside)
router.get('/author', getAsideAuthor)

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
    let selectSqlTwo = await mysql.query(`SELECT columnId AS id, columnTitle AS title, columnNumber AS num FROM vue_blog_column ORDER BY columnCreateTime`)
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
    let selectSqlFour = await mysql.query(`SELECT DATE_FORMAT(articleCreateTime, '%Y-%m') AS id, COUNT(*) AS num FROM vue_blog GROUP BY DATE_FORMAT(articleCreateTime, '%Y-%m') ORDER BY DATE_FORMAT(articleCreateTime, '%Y-%m') DESC`)
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

async function getAsideAuthor(req, res, next) {
  try {
    let selectData = await mysql.query(`SELECT authorId, authorName, authorHeadimg, authorEmail, authorIntroduce FROM vue_blog_author WHERE authority < 2`)
    let viewAndStar = await mysql.query(`SELECT articleAuthorId, SUM(articleView) as articleView, SUM(articleStart) as articleStart FROM vue_blog GROUP BY articleAuthorId WITH ROLLUP`)
    for (let index = 0, len = selectData.length; index < len; index++) {
      let articleList = await mysql.query(`SELECT articleId AS id, articleTitle AS title, articleView AS num FROM vue_blog WHERE articleAuthorId = ${selectData[index].authorId} ORDER BY articleView DESC LIMIT 5 OFFSET 0`)
      if (articleList.length) {
        selectData[index].asideArticle = {
          title: '热门文章',
          type: 3,
          info: articleList
        }
        let articleNatureZero = await mysql.query(`SELECT articleId FROM vue_blog WHERE articleAuthorId = ${selectData[index].authorId} AND articleNature = 0`)
        let articleNatureOne = await mysql.query(`SELECT articleId FROM vue_blog WHERE articleAuthorId = ${selectData[index].authorId} AND articleNature = 1`)
        let articleNatureTwo = await mysql.query(`SELECT articleId FROM vue_blog WHERE articleAuthorId = ${selectData[index].authorId} AND articleNature = 2`)
        selectData[index].natureZero = articleNatureZero.length
        selectData[index].natureOne = articleNatureOne.length
        selectData[index].natureTwo = articleNatureTwo.length
        let nowViewAndStar = viewAndStar.filter(item => item.articleAuthorId == selectData[index].authorId)
        selectData[index].views = nowViewAndStar[0].articleView
        selectData[index].stars = nowViewAndStar[0].articleStart
      }
    }
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

module.exports = router;