const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
// var sql2 = require('../sql2')
var sql = require('../sql')


router.get("/", function(req,res){
    let recentActivity = `CALL recentActivity('${req.body.userId}')`

    sql.query(recentActivity, (err,result) => {
        if(err){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        // console.log(result)
        if (result && result.length > 0) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
            // console.log(result[0])
            res.end("Descending" + JSON.stringify(result[0]))

            console.log("Ascending" + JSON.stringify(result[0].reverse()))

        }
        else{
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('No_Data')
        }
    })
})
module.exports = router;