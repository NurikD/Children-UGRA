const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
const loginSql = require('../../configs/sql.json');

const connection = mysql.createConnection({
  host: loginSql.host,
  user: loginSql.user,
  password: loginSql.password,
  database: loginSql.database,
}).promise();
const requiredChildFields = ['name', 'surname', 'patronomic', 'birth_date', 'city_id', 'phone', 'email', 'talent_id', 'study_place'];
const requiredOrganizerFields = ['name', 'surname', 'patronomic', 'birth_date', 'city_id', 'specialty', 'organization', 'phone', 'email'];
const userTypes = ['child', 'organizer'];

/**
 * UserController class handles interactions with user data on the server
 */
class UserController {
  async register(req, res) {
    const data = req.body;
    console.log(data);
    if (!data.password | !userTypes.includes(data.role)) {
      await res.status(400).json('Bad Request');
      console.log(data);
      return;
    }
    const requiredFields = data.role === 'child' ? requiredChildFields : requiredOrganizerFields;
    if (requiredFields.every((key) => Object.keys(data).includes(key))) {
      const sqlUsers = `INSERT INTO users (email, token, role, firstname, lastname, patronymic) 
             VALUES (?, ?, ?, ?, ?, ?);`;
      const sqlChild = 'INSERT INTO children (id, talent, city, studyplace, phone, birthdate) VALUES (?, ?, ?, ?, ?, ?);';

      const token = bcrypt.hashSync(data.password, 8);
      if (data.role === 'child') {
        const values1 = [
          data.email,
          token,
          data.role,
          data.name,
          data.surname,
          data.patronomic,
        ];

        const values2 = [
          data.talent_id,
          data.city_id,
          data.study_place,
          data.phone,
          new Date(data.birth_date).getTime(),
        ];

        connection.query(sqlUsers, values1)
          .then((result) => {
            console.log(result);
            connection.query(sqlChild, [result[0].insertId, ...values2])
              .then((result) => {
                res.status(200).json(token);
              });
          })
          .catch(async (error) => {
            switch (error.errno) {
              case 1062:
                await res.status(409).json('Child with this email already exist');
                break;
              default:
                console.log(error);
                await res.status(500).json('Internal Server Error');
                break;
            }
          });
      } else {
        const values = [
          id,
          token,
          data.name,
          data.surname,
          data.patronomic,
          data.email,
          new Date(data.birth_date).getTime(),
          data.city_id,
          data.organization,
          data.specialty,
          data.phone,
        ];

        connection.query(sqlOrganizer, values).then((result) => {
          connection.query(sqlRoles, [id, token, 'organizer'])
            .then((result) => {
              res.status(200).json(token);
            });
        })
          .catch(async (error) => {
            switch (error.errno) {
              case 1062:
                await res.status(409).json('Child with this email already exist');
                break;
              default:
                console.error(error);
                await res.status(500).json('Internal Server Error');
                break;
            }
          });
      }
    } else {
      res.status(400).json('Bad Request');
    }
  }

  async login(req, res) {
    if (!req.body.password || !req.body.email) {
      await res.status(400).json('Bad Request');
      return;
    }

    const sqlFind = 'SELECT token, role FROM users WHERE email = ?';

    connection.query(sqlFind, [req.body.email]).then(async (result) => {
      if (result[0].length === 0) {
        await res.status(401).json('Unauthorized');
      } else {
        bcrypt.compare(req.body.password, result[0][0].token, async (err, answer) => {
          if (answer) {
            console.log(result[0][0])
            res.status(200).json({ token: result[0][0].token, role: result[0][0].role });
          } else {
            await res.status(401).json('Unauthorized');
          }
        });
      }
    })
      .catch(async (error) => {
        console.log(error);
        await res.status(500).json('Internal Server Error');
      });
  }

  async getById(req, res) {
    if (req.params.role !== 'children' && req.params.role !== 'organizer') {
      await res.status(400).json('Bad Request');
      return;
    }

    const sql = `SELECT * FROM ${req.params.role} WHERE id = "${req.params.id}"`;
    connection.query(sql).then(async (result) => {
      if (result[0].length === 0) {
        await res.status(401).json('Unauthorized');
      } else {
        await res.status(200).json(result[0]);
      }
    })
      .catch(async (error) => {
        console.log(error);
        await res.status(500).json({ error: 'Internal Server Error' });
      });
  }

  async updateById(req, res) {
    if (req.params.role !== 'children' && req.params.role !== 'organizer') {
      await res.status(400).json('Bad Request');
      return;
    }

    let sql = `SELECT * FROM "${req.params.role}" WHERE id = "${req.params.id}"`;
    connection.query(sql).then(async (result) => {
      if (result[0].length === 0) {
        await res.status(401).json('Unauthorized');
      } else {
        const data = result[0];

        data.surname = req.body.surname === undefined ? data.surname : req.body.surname;
        data.name = req.body.name === undefined ? data.name : req.body.name;
        data.patronomic = req.body.patronomic === undefined ? data.patronomic : req.body.patronomic;
        data.birth_date = req.body.birth_date === undefined ? data.birth_date : req.body.birth_date;
        data.city_id = req.body.city_id === undefined ? data.city_id : req.body.city_id;
        data.talent_id = req.body.talent_id === undefined ? data.talent_id : req.body.talent_id;
        data.place_study = req.body.place_study === undefined ? data.place_study : req.body.place_study;
        data.specialty = req.body.specialty === undefined ? data.specialty : req.body.specialty;
        data.organization = req.body.organization === undefined ? data.organization : req.body.organization;
        data.phone = req.body.phone === undefined ? data.phone : req.body.phone;
        data.confirmed = req.body.confirmed === undefined ? data.confirmed : req.body.confirmed;

        if (req.params.role === 'children') {
          if (!data.surname
            || !data.name
            || !data.patronomic
            || !data.birth_date
            || !data.city_id
            || !data.talent_id
            || !data.place_study
            || !data.phone) {
            await res.status(400).json('Bad Request');
            return;
          }
          sql = `UPDATE children SET
          surname = "${data.surname}", 
          name = "${data.name}", 
          patronomic = "${data.patronomic}", 
          birth_date = ${data.birth_date}, 
          city_id = ${data.city_id}, 
          talent_id = ${data.talent_id}, 
          place_study = "${data.place_study}", 
          phone = "${data.phone}", 
          email = "${data.email}"
          WHERE id = "${req.params.id}"`;
        } else if (req.params.role === 'organizer') {
          if (!data.surname
            || !data.name
            || !data.patronomic
            || !data.birth_date
            || !data.city_id
            || !data.specialty
            || !data.organization
            || !data.phone
            || !data.confirmed) {
            await res.status(400).json('Bad Request');
            return;
          }
          sql = `UPDATE organizers SET 
          surname = "${data.surname}", 
          name = "${data.name}", 
          patronomic = "${data.patronomic}", 
          birth_date = ${data.birth_date}, 
          specialty = ${data.specialty}, 
          talent_id = ${data.talent_id}, 
          organization = "${data.organization}", 
          phone = "${data.phone}", 
          email = "${data.email}", 
          confirmed = "${data.confirmed}"
          WHERE id = "${req.params.id}"`;
        }

        connection.query(sql).then(async (result2) => {
          if (result2[0].length === 0) {
            await res.status(401).json('Unauthorized');
          } else {
            await res.status(200).json('Ok');
          }
        })
          .catch(async (error) => {
            console.log(error);
            await res.status(500).json('Internal Server Error');
          });
      }
    })
      .catch(async (error) => {
        console.log(error);
        await res.status(500).json('Internal Server Error');
      });
  }

  async deleteById(req, res) {
    if (req.params.role !== 'children' && req.params.role !== 'organizer') {
      await res.status(400).json('Bad Request');
      return;
    }

    let sql;

    if (req.params.role === 'children') {
      sql = `DELETE FROM children WHERE id = "${req.params.id}"`;
    } else if (req.params.role === 'organizer') {
      sql = `DELETE FROM organizers WHERE id = "${req.params.id}"`;
    }

    connection.query(sql).then(async (result) => {
      if (result[0].length === 0) {
        await res.status(401).json('Unauthorized');
      } else {
        await res.status(200).json('Ok');
      }
    })
      .catch(async (error) => {
        console.log(error);
        await res.status(500).json('Internal Server Error');
      });
  }

  // async getMe(req, res) {
  //   const sql = `SELECT * FROM users HAVING phone = "${req.user.phone}"`;
  //   connection.query(sql).then(async result =>{
  //     await res.status(200).json({ data: result[0]});
  //   })
  //   .catch(async error =>{
  //     await res.status(500).json({ error: 'Internal Server Error'});
  //   });
  // };
  // async update(req, res) {
  //   const sqlG = `SELECT * FROM users HAVING phone = "${req.user.phone}"`;
  //   connection.query(sqlG).then(async result =>{
  //     const sqlU = `UPDATE users SET
  //     firstname = "${req.body.firstname === undefined ? result[0][0].firstname : req.body.firstname}",
  //     secondname = "${req.body.secondname === undefined ? result[0][0].secondname : req.body.secondname}",
  //     thirdname = "${req.body.thirdname === undefined ? result[0][0].thirdname : req.body.thirdname}",
  //     phone = "${req.body.phone === undefined ? result[0][0].phone : req.body.phone}",
  //     pasport = "${req.body.pasport === undefined ? JSON.stringify(result[0][0].pasport) : req.body.pasport}",
  //     story = "${req.body.story === undefined ? JSON.stringify(result[0][0].story) : req.body.story}",
  //     cards = "${req.body.cards === undefined ? JSON.stringify(result[0][0].cards) : req.body.cards}",
  //     password = "${req.body.password === undefined ? result[0][0].password : req.body.password}"
  //     HAVING phone = "${req.user.phone}"`;

  //     connection.query(sqlU).catch(async error =>{
  //       console.log(error)
  //       await res.status(500).json({ error: 'Internal Server Error'});
  //     });

  //     connection.query(sqlG).then(async result =>{
  //       await res.status(200).json({ data: result[0]});
  //     })
  //   })
  //   .catch(async error =>{
  //     console.log(error)
  //     await res.status(500).json({ error: 'Internal Server Error'});
  //   });
  // }
  // async delete(req, res) {
  //   const sql = `DELETE FROM users HAVING phone = "${req.user.phone}"`;
  //   connection.query(sql).then(async result =>{
  //     if (result[0].affectedRows !==== 0){
  //       await res.status(200).json({ data: 'ok' });
  //     } else {
  //       await res.status(404).json({ error: 'Not Found' });
  //     }
  //   })
  //   .catch(async error =>{
  //     console.log(error)
  //     await res.status(500).json({ error: 'Internal Server Error'});
  //   });
  // }
}

module.exports = new UserController();
