const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 80;
const HOST = '127.0.0.1';
const mysql = require('mysql2');
const auth = require('./middlewares/authentication');
const loginSql = require('./configs/sql.json');

const con = mysql.createConnection({
  host: loginSql.host,
  user: loginSql.user,
  password: loginSql.password,
  database: loginSql.database,
}).promise();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(express.static(`${__dirname}/static`));
app.use(express.static(path.join(__dirname, '/static/html'), { index: false, extensions: ['html'] }));
app.use('/certificate', express.static(path.join(`${__dirname}/storage/documents/certificate`)));
app.get('/certificate/:id', auth, (req, res) => {
  fs.readdir(`${__dirname}/storage/documents/certificate/${req.params.id}`, (err, files) => {
    if (err) { res.status(200).json(0); } else {
      const answ = {};
      for (const file in files) {
        answ[Number(file) + 1] = files[file];
      }
      res.status(200).json(answ);
    }
  });
});

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (req.body.type) {
      case 'avatar':
        cb(null, 'storage/images/avatars');
        break;
      case 'certificate':
        const token = req.headers.authorization;
        if (!token) { return res.status(403).json({ error: 'A token is required for authentication' }); }

        let sql = `SELECT * FROM users WHERE token = '${token}';`;
        con.query(sql).then(async (user) => {
          if (user[0].length === 0) return res.status(401).json({ error: 'Invalid Token' });
          if (user[0][0].role === 'admin') { req.user = user[0][0]; } else {
            sql = `SELECT * FROM children WHERE id = '${user[0][0].id}';`;
            con.query(sql).then(async (children) => {
              const obj = { ...user[0][0], ...children[0][0] };
              req.user = obj;
            })
              .catch(async (error) => { console.log(error); return res.status(401).json({ error: 'Invalid Token' }); });
          }
        })
          .catch(async (error) => { console.log(error); return res.status(401).json({ error: 'Invalid Token' }); });

        console.log('ответ загрузки', req.user);
        fs.access(`${__dirname}/storage/documents/certificate/${req.user?.id}`, () => {
          if (error) {
            fs.mkdir(`${__dirname}/storage/documents/certificate/${req.user?.id}`, () => {});
          }
          cb(null, `${__dirname}/storage/documents/certificate/${req.user?.id}`);
        });
        break;
      default:
        cb(null, 'storage/images');
        break;
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// app.use(auth)
app.post('/upload', multer({ storage: storageConfig }).single('filedata'), (req, res) => {
  if (!req.file) { res.send('Ошибка при загрузке файла'); } else { res.send('Файл загружен'); }
});

app.get('/test', auth, (req, res) => { res.send(req?.user); });

app.use('/users', require('./routers/api/user'));
app.use('/search', require('./routers/api/search'));
// app.use('/events', require('./routers/api/events'));

const startApp = async () => {
  app.listen(PORT, () => console.log(`start: ok, http://${HOST}:${PORT}`));
};
startApp();
