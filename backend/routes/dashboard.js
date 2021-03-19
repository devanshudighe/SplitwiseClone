var express = require('express');
var router = express.Router();
var sql2 = require('../sql2')
var sql = require('../sql')

router.get('/:user_id', async (req, res) => {
    const getRestUsersSql = `select distinct gu2.user_id as checking_with_user from UserGroupInfo gu1 join UserGroupInfo gu2 on gu1.user_id <> gu2.user_id and gu1.group_id = gu2.group_id where gu1.user_id = ${req.params.user_id};`;
    const balancesSql = `CALL get_balances('${req.params.user_id}', ? )`;
    const balances = [];

    sql2.query(getRestUsersSql)
        .then((rows) => {
            const promiseList = rows[0].map((row) => new Promise((resolve, reject) => sql2.query(balancesSql, row.checking_with_user)
                .then((subRows) => {
                    subRows[0][0].map((subRow) => {
                        const balance = {
                            user1: subRow.logged_in_user,
                            user1_name: subRow.logged_in_user_name,
                            user2: subRow.checking_with_user,
                            user2_name: subRow.checking_with_user_name,
                            net_amt: subRow.net_amt,
                            collect_or_pay: subRow.collect_or_pay,
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
    let settleUp = `CALL settle_up('${req.body.userId}','${req.body.owedName}','${req.body.amount}')`
    console.log(settleUp)
    sql.query(settleUp, (err,result) => {
        if(err){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        console.log(result)
        if (result[0][0].flag === "SETTLED_UP") {
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