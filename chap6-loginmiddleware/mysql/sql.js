
const bodyParser = require('body-parser')
const mysql = require('mysql')
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'chapter6'
})
// Get all beers'
class userDb {
    async user(req, res) {
        pool.getConnection((err, connection) => {
            if(err) throw err
            console.log('connected as id ' + connection.threadId)
            connection.query('SELECT * from user_game', (err, rows) => {
                connection.release() // return the connection to pool
    
                if (!err) {
                    res.send(rows)
                } else {
                    console.log(err)
                }
    
                // if(err) throw err
                console.log('The data from beer table are: \n', rows)
            })
        })
    }
  }
  
  module.exports = userDb;
  