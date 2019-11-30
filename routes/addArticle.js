const express = require('express')
const moment = require('moment')
const router = express.Router()
const mysql = require('./../mysql/db')
const MarkdownIt = require('markdown-it')
const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const hljs = require('highlight.js')
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

router.post('/', addArticle)

async function addArticle(req, res, next) {
  try {
    let subTitle = req.body.content.slice(0, 200)
    let titleArray = []
    let titleObject = {}
    let articleContentHtml = md.use(markdownItTocAndAnchor, {
      tocCallback: function (tocMarkdown, tocArray, tocHtml) {
        titleArray = tocArray
      }
    }).render(`@[toc]${req.body.content}`)
    let insertData = await mysql.query('INSERT INTO vue_blog (articleTitle, articleSubTitle, articleNature, articleKey, articleContentMarkdown, articleContentHtml, articleAuthorId, articleCreateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.title, subTitle, req.body.nature, req.body.keyWords.join(), req.body.content, articleContentHtml, req.body.authorId, moment().format('YYYY-MM-DD HH:mm:ss')])
    if (titleArray.length) {
      titleArray.map(item => {
        if (titleObject.hasOwnProperty(`h${item.level}`)) {
          titleObject[`h${item.level}`] += `,${item.content}`
        } else {
          titleObject[`h${item.level}`] = item.content
        }
      })
      await mysql.query('INSERT INTO vue_blog_title (articleId, h1, h2, h3, h4, h5, h6) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          insertData.insertId, 
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

module.exports = router;