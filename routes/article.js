const express = require('express')
const moment = require('moment')
const router = express.Router()
const mysql = require('./../mysql/db')
const MarkdownIt = require('markdown-it')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const hljs = require('highlight.js')

router.post('/add', addArticle)
router.post('/update', updateArticle)
router.get('/detail', getArticleDetail)
router.post('/delete', deleteArticle)

async function addArticle(req, res, next) {
  try {
    let subTitle = req.body.content.slice(0, 200)
    let titleArray = []
    let titleObject = {}
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        const codeIndex = parseInt(Date.now()) + Math.floor(Math.random() * 10000000)
        let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`
        const linesLength = str.split(/\n/).length - 1
        let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'
        for (let index = 0; index < linesLength; index++) {
          linesNum = linesNum + '<span></span>'
        }
        linesNum += '</span>'
        if (lang && hljs.getLanguage(lang)) {
          try {
            const preCode = hljs.highlight(lang, str, true).value
            html = html + preCode
            if (linesLength) {
              html += '<b class="name">' + lang + '</b>'
            }
            return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;textarea>')}</textarea>`
          } catch (error) {
            console.log(error)
          }
        }

        const preCode = md.utils.escapeHtml(str)
        html = html + preCode
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str.replace(/<\/textarea>/g, '&lt;textarea>')}</textarea>`
      }
    })
    let articleContentHtml = md.use(markdownItTocAndAnchor, {
      tocCallback: function (tocMarkdown, tocArray, tocHtml) {
        titleArray = tocArray
      }
    }).use(require('markdown-it-sub')).use(require('markdown-it-sup')).use(require('markdown-it-deflist')).use(require('markdown-it-abbr')).use(require('markdown-it-footnote')).use(require('markdown-it-ins')).use(require('markdown-it-mark')).render(`@[toc]\r${req.body.content}`)
    let insertData = await mysql.query('INSERT INTO vue_blog (articleTitle, articleSubTitle, articleNature, articleKey, articleContentMarkdown, articleContentHtml, articleAuthorId, articleCreateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.title, subTitle, req.body.nature, req.body.keyWords.join(), req.body.content, articleContentHtml, req.body.authorId, moment().format('YYYY-MM-DD HH:mm:ss')])
    titleArray.map(item => {
      if (titleObject.hasOwnProperty(`h${item.level}`)) {
        titleObject[`h${item.level}`] += `,${item.content}`
      } else {
        titleObject[`h${item.level}`] = item.content
      }
    })
    await mysql.query('INSERT INTO vue_blog_title (articleId, h0, h1, h2, h3, h4, h5, h6) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        insertData.insertId,
        req.body.title,
        titleObject.h1 ? titleObject.h1 : '',
        titleObject.h2 ? titleObject.h2 : '',
        titleObject.h3 ? titleObject.h3 : '',
        titleObject.h4 ? titleObject.h4 : '',
        titleObject.h5 ? titleObject.h5 : '',
        titleObject.h6 ? titleObject.h6 : ''
      ]
    )
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

async function updateArticle(req, res, next) {
  try {
    let subTitle = req.body.content.slice(0, 200)
    let titleArray = []
    let titleObject = {}
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        const codeIndex = parseInt(Date.now()) + Math.floor(Math.random() * 10000000)
        let html = `<button class="copy-btn" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制</button>`
        const linesLength = str.split(/\n/).length - 1
        let linesNum = '<span aria-hidden="true" class="line-numbers-rows">'
        for (let index = 0; index < linesLength; index++) {
          linesNum = linesNum + '<span></span>'
        }
        linesNum += '</span>'
        if (lang && hljs.getLanguage(lang)) {
          try {
            const preCode = hljs.highlight(lang, str, true).value
            html = html + preCode
            if (linesLength) {
              html += '<b class="name">' + lang + '</b>'
            }
            return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str}</textarea>`
          } catch (error) {
            console.log(error)
          }
        }

        const preCode = md.utils.escapeHtml(str)
        html = html + preCode
        return `<pre class="hljs"><code>${html}</code>${linesNum}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${str}</textarea>`
      }
    })
    let articleContentHtml = md.use(markdownItTocAndAnchor, {
      tocCallback: function (tocMarkdown, tocArray, tocHtml) {
        titleArray = tocArray
      }
    }).use(require('markdown-it-sub')).use(require('markdown-it-sup')).use(require('markdown-it-deflist')).use(require('markdown-it-abbr')).use(require('markdown-it-footnote')).use(require('markdown-it-ins')).use(require('markdown-it-mark')).render(`@[toc]\r${req.body.content}`)
    console.log(articleContentHtml)
    let updateData = await mysql.query('UPDATE vue_blog SET articleTitle = ?, articleSubTitle = ?, articleNature = ?, articleKey = ?, articleContentMarkdown = ?, articleContentHtml = ?, articleUpdateTime  = ? WHERE articleId = ?',
      [req.body.title, subTitle, req.body.nature, req.body.keyWords.join(), req.body.content, articleContentHtml, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.articleId])

    titleArray.map(item => {
      if (titleObject.hasOwnProperty(`h${item.level}`)) {
        titleObject[`h${item.level}`] += `,${item.content}`
      } else {
        titleObject[`h${item.level}`] = item.content
      }
    })
    let selectTitle = await mysql.query('SELECT articleId FROM vue_blog_title WHERE articleId = ?', [req.body.articleId])
    console.log(selectTitle)
    if (selectTitle.length) {
      await mysql.query('UPDATE vue_blog_title SET h0 = ?, h1 = ?, h2 = ?, h3 = ?, h4 = ?, h5 = ?, h6 = ? WHERE articleId = ?',
        [
          req.body.title,
          titleObject.h1 ? titleObject.h1 : '',
          titleObject.h2 ? titleObject.h2 : '',
          titleObject.h3 ? titleObject.h3 : '',
          titleObject.h4 ? titleObject.h4 : '',
          titleObject.h5 ? titleObject.h5 : '',
          titleObject.h6 ? titleObject.h6 : '',
          req.body.articleId
        ]
      )
    } else {
      await mysql.query('INSERT INTO vue_blog_title (articleId, h0, h1, h2, h3, h4, h5, h6) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          req.body.articleId,
          req.body.title,
          titleObject.h1 ? titleObject.h1 : '',
          titleObject.h2 ? titleObject.h2 : '',
          titleObject.h3 ? titleObject.h3 : '',
          titleObject.h4 ? titleObject.h4 : '',
          titleObject.h5 ? titleObject.h5 : '',
          titleObject.h6 ? titleObject.h6 : ''
        ]
      )
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

async function getArticleDetail(req, res, next) {
  try {
    const articleId = req.query.articleId * 1
    let selectData = await mysql.query(`SELECT * FROM vue_blog WHERE articleId = ?`,
      [articleId])
    let authorInfo = await mysql.query(`SELECT authorId, authorName FROM vue_blog_author WHERE authorId = ?`,
      [selectData[0].articleAuthorId])
    if (req.query.changeView == 1) {
      await mysql.query(`UPDATE vue_blog SET articleView = ? WHERE articleId = ?`,
        [selectData[0].articleView + 1, articleId])
    }
    let articleIdArray = await mysql.query(`SELECT articleId FROM vue_blog ORDER BY articleId DESC`)
    articleIdArray = articleIdArray.map(item => item.articleId)
    let nowIndex = articleIdArray.indexOf(articleId)
    let prevInfo, nextInfo, prevIndex, nextIndex
    if (nowIndex > 0 && nowIndex < articleIdArray.length - 1) {
      prevIndex = nowIndex - 1
      nextIndex = nowIndex + 1
    } else if (nowIndex === 0) {
      prevIndex = articleIdArray.length - 1
      nextIndex = nowIndex + 1
    } else if (nowIndex === articleIdArray.length - 1) {
      prevIndex = nowIndex - 1
      nextIndex = 0
    }
    prevInfo = await mysql.query(`SELECT articleId, articleTitle FROM vue_blog WHERE articleId = ?`,
      [articleIdArray[prevIndex]])
    nextInfo = await mysql.query(`SELECT articleId, articleTitle FROM vue_blog WHERE articleId = ?`,
      [articleIdArray[nextIndex]])
    return res.json({
      isok: true,
      data: {
        info: selectData.length ? selectData[0] : [],
        prevInfo: prevInfo.length ? prevInfo[0] : [],
        nextInfo: nextInfo.length ? nextInfo[0] : [],
        authorInfo: authorInfo[0]
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

async function deleteArticle(req, res, next) {
  try {
    let selectArticleInfo = await mysql.query('SELECT articleAuthorId FROM vue_blog WHERE articleId = ?', [req.body.articleId])
    let selectUserInfo = await mysql.query('SELECT authority FROM vue_blog_author WHERE authorId = ?', [req.body.userId])
    if (selectUserInfo[0].authority == 0 || selectArticleInfo[0].articleAuthorId == req.body.userId) {
      let deleteArticleInfo = await mysql.query('DELETE FROM vue_blog WHERE articleId = ?', [req.body.articleId])
      return res.json({
        isok: true,
        msg: ''
      });
    } else {
      return res.json({
        isok: false,
        msg: '无权限操作'
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