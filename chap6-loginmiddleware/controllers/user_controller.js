
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
//Biodata
async biodataPage(req, res) {
  let params = req.query.id;
  
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query('SELECT * from user_game WHERE id = ?',[params], (err, rows) => {
    const dataBiodata = rows ;
    connection.release() // return the connection to pool
    

        if (!err) {
          console.log(dataBiodata);
          // return dataBiodata ;
          return res.render("biodata", {
            dataBiodata,
          });
        } 
        else {
            console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
    })
})
}
//Edit 
async editPage(req, res) {
  let params = req.query.id;
  
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query('SELECT * from user_game WHERE id = ?',[params], (err, rows) => {
    const dataEdit = rows ;
    connection.release() // return the connection to pool
    

        if (!err) {
          console.log(dataEdit);
          // return dataEdit ;
          return res.render("edit", {
            dataEdit,
          });
        } 
        else {
            console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
    })
})
}

//edit post
async doEdit(req, res) {
  let params = req.body.id;
  let params2 = req.body.username;
  let params3 = req.body.password;
  let params4 = req.body.city;
  let params5 = req.body.gender;
  console.log(params,params2,params3,params4,params5);
  
  
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query('UPDATE user_game SET username = ?, password = ?,  city = ?, gender = ? WHERE id = ? ',[params2,params3,params4,params5,params], (err, rows) => {
 
    connection.release() // return the connection to pool
    

        if (!err) {
          // return dataEdit ;
          return res.redirect("/admin"); 
        } 
        else {
            console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
    })
})
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
 //deletePage
 async deletePage(req, res) {
  let params = req.query.id;
  
  console.log('masuk gan', params);
  pool.getConnection((err, connection) => {
    if(err) throw err
    connection.query('DELETE from user_game_biodata WHERE id = ?',[params], (err, rows) => {
    connection.release() // return the connection to pool
    

        if (!err) {
          res.send("BERHASIL DIHAPUS");
        } 
        else {
            console.log(err)
        }

        // if(err) throw err
        console.log('The data from beer table are: \n', params)
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
    //DataBase admnin
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query('SELECT user_game.id ,user_game.username, user_game.password , user_game_biodata.Skor , user_game_biodata.Last_Update FROM user_game LEFT JOIN user_game_biodata ON user_game.id=user_game_biodata.id', (err, rows) => {
      const dataUserBiodata = rows ;
      console.log(dataUserBiodata, 'masuk gan');
      connection.release() // return the connection to pool
      

          if (!err) {
            console.log(dataUserBiodata[0].Username);
            return res.render("admin", {
              username,
              role,
              dataUserBiodata,
            });
          } else {
              console.log(err)
          }

          // if(err) throw err
          console.log('The data from beer table are: \n', rows)
      })
  })
    
  }

  async logout(req, res) {
    req.session.destroy(() => {
      // update ke table user login history dan set logoutAt = new Date where historyId
      return res.redirect("/login");
    });
  }
}

module.exports = UserController;
