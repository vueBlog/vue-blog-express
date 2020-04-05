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
  let result = {
    path: '/',
    name: 'Admin',
    component: 'Admin',
    meta: {
      title: '个人中心',
      requiresAuth: true,
      roles: [0, 1, 2]
    },
    redirect: '/base',
    children: [
      {
        path: 'base',
        name: 'AdminBase',
        component: 'AdminBase',
        meta: {
          title: '基本信息',
          requiresAuth: true,
          roles: [0, 1, 2]
        }
      }
    ]
  }

  if ([0, 1].includes(req.body.type * 1)) {
    result.children.push({
      path: 'vip',
      name: 'AdminVip',
      component: 'AdminVip',
      meta: {
        title: 'Vip信息',
        requiresAuth: true,
        roles: [0, 1]
      }
    })
  }

  if (req.body.type * 1 === 0) {
    result.children.push({
      path: 'admin',
      name: 'AdminAdmin',
      component: 'AdminAdmin',
      meta: {
        title: '管理员',
        requiresAuth: true,
        roles: [0]
      }
    })
  }

  return res.json({
    isok: true,
    msg: '',
    data: result
  });
}

module.exports = router;
