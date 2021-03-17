var express = require('express');
var router = express.Router();
var sql = require('../sql')

router.post('/', function (req, res) {
    let createGroups = `CALL newMemberInvitation('${req.body.invitationEmail}','${req.body.groupName}')`
    console.log(createGroups)
    sql.query(createGroups, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        if (result && result.length > 0 && result[0][0].flag == 'MEMBER_DOES_NOT_EXIST') {
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('Member not on Splitwise')
        }
        else if(result && result.length > 0 && result[0][0].flag == 'GROUP_DOES_NOT_EXIST') {
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('Group is not present')
        }
        else if(result && result.length > 0 && result[0][0].flag == 'MEMBER_ALREADY_INVITED') {
            res.writeHead(401, {
                'Content-Type': 'text/plain'
                });
            res.end('Person is already invited')
            
        }
        else if(result && result.length > 0 && result[0][0].flag == 'MEMBER_INVITED') {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
            res.end('Invitation Sent')
            
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