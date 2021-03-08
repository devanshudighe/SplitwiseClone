var express = require('express');
var router = express.Router();
var sql = require('../sql')

router.post("/", function(req,res) {
    let addBill = `CALL AddUserBill('${req.body.groupId}','${req.body.billName}','${req.body.billPaidBy}','${req.body.billAmount}')`

    sql.query(addBill, (err,result) => {
        if(err){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        if (result && result.length > 0) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
            // console.log(result[0])
            res.end(JSON.stringify(result[0]))

        }
        else{
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('No_Data')
        }
    })
});

module.exports = router;