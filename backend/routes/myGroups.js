var express = require('express');
var router = express.Router();
var sql = require('../sql')

router.get('/', function (req, res) {
    console.log("Inside get")
    let myInvitations = `CALL groupInvitationDashboard('${req.body.userId}')`

    sql.query(myInvitations, (err, result) => {
        if (err) {
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
            console.log(result[0])
            res.end('Fetched Group')

        }
        else{
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('No_Data')
        }
    })
});
router.post('/', function (req, res) {
    let acceptInvite = `CALL groupInvitationAccepted('${req.body.userId}', '${req.body.groupName}')`

    sql.query(acceptInvite, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        if (result && result.length > 0) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
            console.log(result[0])
            res.end('Invite Accepted')

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