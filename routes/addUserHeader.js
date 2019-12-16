const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')
const multer = require('multer')

let path = 'public/images/header'
let currentPath
let storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: path,
  // 给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    currentPath = `id-${req.body.id}.${file.mimetype.slice(6)}`
    cb(null, currentPath)
  }
})
let upload = multer({
  storage: storage
})

router.post('/', upload.single('file'), addImage)

async function addImage(req, res, next) {
  try {
    let imgPath = `images/header/${currentPath}`
    await mysql.query('UPDATE vue_blog_author SET authorHeadimg = ? WHERE authorId = ?',
      [imgPath, req.body.id]);
    return res.json({
      isok: true,
      msg: '',
      data: {
        src: imgPath
      }
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