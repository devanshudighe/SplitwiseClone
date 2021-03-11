var express = require('express');
var router = express.Router();
var sql2 = require('../sql2')
var sql = require('../sql')

router.get('/', async (req, res) => {
    const getRestUsersSql = `select distinct gu2.user_id as owed_id from UserGroupInfo gu1 join UserGroupInfo gu2 on gu1.user_id <> gu2.user_id and gu1.group_id = gu2.group_id where gu1.user_id = ${req.body.user_id} and gu1.group_id = gu2.group_id;`;
    const balancesSql = `select collect_amount-owed_amount as net_amount from (select ifnull(sum(amount),0) as collect_amount from UserBillSplit where user_id=${req.body.user_id} and owed_id=?) as s1 join (select ifnull(sum(amount),0) as owed_amount from UserBillSplit where user_id=? and owed_id=${req.body.user_id}) as s2;`;
    const balances = [];
    console.log("inside get")
    sql2.query(getRestUsersSql)
        .then((rows) => {
            const promiseList = rows[0].map((row) => new Promise((resolve, reject) => sql2.query(balancesSql, [row.owed_id, row.owed_id])
                .then((subRows) => {
                    subRows[0].map((subRow) => {
                        console.log(row.owed_id);
                        const balance = {
                            user1: req.body.user_id,
                            user2: row.owed_id,
                            net_amt: subRow.net_amount,
                        };
                        balances.push(balance);
                    });
                    console.log(balances)
                    resolve(balances);
                }, (err) => {
                    reject(err);
                })));
            Promise.all(promiseList).then((result) => {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({ message: balances }));
            }).catch((err) => {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({ message: err }));
            });
        });
});


router.post("/", function(req,res){
    let settleUp = `INSERT INTO UserBillSplit(bill_id,user_id,owed_id,amount) VALUES(-1,'${req.body.userId}','${req.body.owedId}','${req.body.amount}')`

    sql.query(settleUp, (err,result) => {
        if(err){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        if (result && result.affectedRows > 0) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
            console.log(result[0])
            res.end('You are settled Up')

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