const { json } = require('body-parser');
var express = require('express');
var router = express.Router();
// var sql2 = require('../sql2')
var sql = require('../sql')

router.get("/user_id/:user_id/group_name/:group_name", function(req,res){
    let groupDetails = `CALL Get_Group_Details('${req.params.user_id}','${req.params.group_name}')`
    console.log(groupDetails)
    sql.query(groupDetails, (err,result) => {
        if(err){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        console.log(result)
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
})
module.exports = router;