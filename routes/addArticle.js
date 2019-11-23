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
    let articleContentHtml = md.use(markdownItTocAndAnchor).render(req.body.content)
    let insertData = await mysql.query('INSERT INTO vue_blog (articleTitle, articleSubTitle, articleNature, articleKey, articleContentMarkdown, articleContentHtml, articleAuthorId, articleCreateTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.title, subTitle, req.body.nature, req.body.keyWords.join(), req.body.content, articleContentHtml, req.body.authorId, moment().format('YYYY-MM-DD HH:mm:ss')])
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