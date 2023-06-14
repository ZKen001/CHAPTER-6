
const bodyParser = require('body-parser')
const mysql = require('mysql')
const pool  = mysql.createPool({
    connectionLimit : 20,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'chapter6'
})

class UserController {
  async loginPage(req, res) {
    if (req.session.User) {
      return res.redirect("/");
    }
    return res.render("login");
  }
//register
async registerPage(req, res) {
  if (req.session.User) {
    return res.redirect("/");
  }

  return res.render("register");
}

  async doLogin(req, res) {
    const { username, password } = req.body;
    console.log( username, password);

    //db
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query('SELECT * from user_game', (err, rows) => {
      const dataUser = rows ;
      connection.release() // return the connection to pool
      

          if (!err) {
            console.log ('masuk gan')
            const foundIndex = dataUser.findIndex((dataUser) => {
              return dataUser.username == username && dataUser.password == password;
            });
            console.log(foundIndex);
            if (foundIndex == -1) {
              return res.redirect("/login");
            }
        
            const userLogin = dataUser[foundIndex];
            // set session
            req.session.User = userLogin;
        
            // insert ke database
        
            if (userLogin.role == "superuser") {
              return res.redirect("/admin");
            } else if (userLogin.role == "user") {
              return res.redirect("/");
            }
          } else {
              console.log(err)
          }

          // if(err) throw err
          console.log('The data from beer table are: \n', rows)
      })
  })
    
  }
  //register DB

  async doregister(req, res) {
    const { username, password , city , gender } = req.body;
    console.log( username, password , city , gender);
    const role = 'user'

    //db
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query('INSERT INTO user_game SET username = ? , password = ? , role = ? , city = ? , gender = ?', [username,password,role,city,gender], (err, rows) => {
      connection.release() // return the connection to pool
      
      if (!err) {
        console.log('masuk gan');
        return res.redirect("/login");
    } else {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
    }
    console.log('The data from beer table are:11 \n', rows)

      })
  })
  }

  async userPage(req, res) {
    const { username, role } = req.session.User;

    return res.render("index", {
      username,
      role,
    });
  }

  async adminPage(req, res) {
    const { username, role } = req.session.User;
    if (role != "superuser") {
      return res.redirect("/login");
    }

    return res.render("admin", {
      username,
      role,
    });
  }

  async logout(req, res) {
    req.session.destroy(() => {
      // update ke table user login history dan set logoutAt = new Date where historyId
      return res.redirect("/login");
    });
  }
}

module.exports = UserController;
