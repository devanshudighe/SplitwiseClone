const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port : 3306,
  password: "devanshu",
  database: "splitwise"
});

con.connect(function (err) {
    if(err){
        throw err;
    }
    console.log("Connected!");
});

module.exports = con;