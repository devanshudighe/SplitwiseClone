var express = require('express');
var router = express.Router();
var sql = require('../sql')

router.post('/', function (req, res) {
    let createGroups = `CALL createGroup('${req.body.userId}','${req.body.groupName}','${req.body.groupImageName}')`

    sql.query(createGroups, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        if (result && result.length > 0 && result[0][0].flag == 'Group_exists') {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
                });
            res.end('Group Already Exists')
        }
        else if(result && result.length > 0 && result[0][0].flag == 'Created_Group') {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
                });
            res.end('New Group Created')
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