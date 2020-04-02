const express = require('express')
const router = express.Router()

router.post('/login', login)
router.post('/getRouter', getRouter)

async function login(req, res, next) {
  return res.json({
    isok: true,
    msg: '',
    data: {}
  });
}

async function getRouter(req, res, next) {
  let result
  if (req.body.type == 0) {
    result = [
      {
        path: 'vip',
        name: 'AdminVip',
        meta: {
          requiresAuth: true,
          authority: 1
        }
      },
      {
        path: 'admin',
        name: 'AdminAdmin',
        meta: {
          requiresAuth: true,
          authority: 0
        }
      }
    ]
  } else if (req.body.type == 1) {
    result = [
      {
        path: 'vip',
        name: 'AdminVip',
        meta: {
          requiresAuth: true,
          authority: 1
        }
      }
    ]
  }
  return res.json({
    isok: true,
    msg: '',
    data: result
  });
}
module.exports = router;