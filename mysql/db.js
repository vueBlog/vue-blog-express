const config = require('./../config.js');
const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 50,
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  multipleStatements: true
});

let query = function (sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

module.exports = {
  query
}
