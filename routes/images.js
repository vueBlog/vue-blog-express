const express = require('express')
const router = express.Router()
const mysql = require('../mysql/db')
const multer = require('multer')

//获取时间
function getNowFormatDate() {
  const date = new Date()
  const seperator1 = "-"
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = "0" + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate
  }
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  return currentdate.toString()
}
let datatime = getNowFormatDate()
let path = 'public/images/' + datatime
let storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: path,
  // 给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 100000000)}.${file.mimetype.slice(6)}`)
  }
})
let upload = multer({
  storage: storage
})

router.post('/add', upload.array('image', 5), addImage)
// router.post('/delete', deleteImage)

async function addImage(req, res, next) {
  try {
    const files = req.files
    if (!files[0]) {
      return res.json({
        isok: false,
        msg: err
      });
    } else {
      let imgPath = `images/${datatime}/${files[0].filename}`
      await mysql.query('INSERT INTO vue_blog_img (articleId, imgPath) VALUES (?, ?)',
        [req.body.articleId, imgPath])
      return res.json({
        isok: true,
        msg: '',
        data: {
          src: imgPath
        }
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

// async function deleteImage(req, res, next) {
//   try {

//   } catch (error) {
//     return res.json({
//       isok: false,
//       msg: error
//     });
//   }
//   next();
// }

module.exports = router;