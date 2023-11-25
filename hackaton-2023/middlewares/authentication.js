const mysql = require('mysql2');
const loginSql = require('../configs/sql.json');

const con = mysql.createConnection({
  host: loginSql.host,
  user: loginSql.user,
  password: loginSql.password,
  database: loginSql.database,
}).promise();

const verifyToken = (req, res, next) => {
  // достаём токен
  const token = req.headers.authorization || req.query.headers.Authorization;
  if (!token) {
    return res.status(403).json({ error: 'A token is required for authentication' });
  }

  let sql = `SELECT * FROM users WHERE token = '${token}';`;
  con.query(sql).then(async (user) => {
    console.log('ответ мидла', user[0]);
    if (user[0].length === 0) return res.status(401).json({ error: 'Invalid Token' });

    if (user[0][0].role === 'admin') {
      req.user = user[0][0];
      return next();
    }
    sql = `SELECT * FROM children WHERE id = '${user[0][0].id}';`;
    con.query(sql).then(async (children) => {
      if (children[0].length === 0) return res.status(401).json({ error: 'Invalid Token' });

      const obj = { ...user[0][0], ...children[0][0] };
      req.user = obj;
      return next();
    })
      .catch(async (error) => {
        console.log(error);
        return res.status(401).json({ error: 'Invalid Token' });
      });
  })
    .catch(async (error) => {
      console.log(error);
      return res.status(401).json({ error: 'Invalid Token' });
    });
};

module.exports = verifyToken;
