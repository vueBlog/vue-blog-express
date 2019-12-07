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
        const preCode = hljs.highlight(lang, str, true).value
        const lines = preCode.split(/\n/).slice(0, -1)
        let html = lines.map((item, index) => {
          return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
        }).join('')
        html = '<ol>' + html + '</ol>'
        if (lines.length > 3) {
          html += '<b class="name">' + lang + '</b>'
        }
        return '<pre class="hljs"><code>' + 
          html +
          '</code></pre>'
      } catch (__) {}
    }

    const preCode = md.utils.escapeHtml(str)
    const lines = preCode.split(/\n/).slice(0, -1)
    let html = lines.map((item, index) => {
      return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
    }).join('')
    html = '<ol>' + html + '</ol>'
    return '<pre class="hljs"><code>' + 
      html +
      '</code></pre>'
  }
})

router.post('/', updateArticle)

async function updateArticle(req, res, next) {
  try {
    let subTitle = req.body.content.slice(0, 200)
    let titleArray = []
    let titleObject = {}
    let articleContentHtml = md.use(markdownItTocAndAnchor, {
      tocCallback: function (tocMarkdown, tocArray, tocHtml) {
        titleArray = tocArray
      }
    }).render(`@[toc]${req.body.content}`)

    let updateData = await mysql.query('UPDATE vue_blog SET articleTitle = ?, articleSubTitle = ?, articleNature = ?, articleKey = ?, articleContentMarkdown = ?, articleContentHtml = ?, articleUpdateTime  = ? WHERE articleId = ?',
      [req.body.title, subTitle, req.body.nature, req.body.keyWords.join(), req.body.content, articleContentHtml, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.articleId])
    if (titleArray.length) {
      titleArray.map(item => {
        if (titleObject.hasOwnProperty(`h${item.level}`)) {
          titleObject[`h${item.level}`] += `,${item.content}`
        } else {
          titleObject[`h${item.level}`] = item.content
        }
      })
      await mysql.query('UPDATE vue_blog_title SET h1 = ?, h2 = ?, h3 = ?, h4 = ?, h5 = ?, h6 = ? WHERE articleId = ?',
        [
          titleObject.h1 ? titleObject.h1 : '',
          titleObject.h2 ? titleObject.h2 : '',
          titleObject.h3 ? titleObject.h3 : '',
          titleObject.h4 ? titleObject.h4 : '',
          titleObject.h5 ? titleObject.h5 : '',
          titleObject.h6 ? titleObject.h6 : '',
          req.body.articleId
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