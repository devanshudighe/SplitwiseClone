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

router.get("/:group_name", function(req,res){
    let getGroupDues = `SELECT bt.user_id, MAX(CASE WHEN bt.user_id=u.user_id THEN u.name END) AS user1,
                        bt.owed_id, MAX(CASE WHEN bt.owed_id=u.user_id THEN u.name END) AS user2,
                        g.group_id, bt.amount, bt.settled FROM UserBillSplit bt
                        JOIN UserBillDetails b ON bt.bill_id=b.bill_id
                        JOIN GroupInfo g ON b.group_id = g.group_id JOIN UserDetails u
                        WHERE g.group_name = '${req.params.group_name}'
                        GROUP BY bt.user_id, bt.owed_id, g.group_id, bt.amount, bt.settled;`
    sql.query(getGroupDues, (err,result) => {
        
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
            res.end(JSON.stringify(result))
        }
        else{
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('No_Data')
        }
    })
    
})

router.post("/",function(req,res){
    let leaveGroup = `CALL Group_Member_Leave('${req.body.userId}','${req.body.groupName}')`
    console.log(leaveGroup)
    sql.query(leaveGroup, (err,result) => {
        if(err){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
            // console.log(err)
        }
        console.log(result)
        if (result && result[0]) {
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