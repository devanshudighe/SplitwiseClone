const mysql = require('mysql2/promise');

var con = mysql.createPool({
  host: "localhost",
  user: "root",
  port : 3306,
  password: "devanshu",
  database: "splitwise",
  // connectionLimit : 100
});

con.getConnection(function (err) {
    if(err){
        throw err;
    }
    console.log("Connected!");
});

module.exports = con;