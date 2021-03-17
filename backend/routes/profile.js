var express = require('express');
var router = express.Router();
var sql = require('../sql');


router.get('/:user_id', function (req, res) {
    // const userId = localStorage.getItem('userId');
    // console.log('Inside Profile get request');
    let userDetails = `CALL getUpdatedUserInfo('${req.params.user_id}');`

    sql.query(userDetails, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
        }
        if (result && result[0].length > 0) {
            let user = {
                userId: result[0][0].user_id,
                user_name: result[0][0].name,
                email: result[0][0].email,
                currency: result[0][0].currency,
                language: result[0][0].language,
                phone: result[0][0].phone,
                timeZone: result[0][0].Timezone
            }
            res.writeHead(200, {
                'Content-type':'application/json',
            })
            console.log(JSON.stringify(user))
            res.end(JSON.stringify(user));
        }
        // else {
        //     res.writeHead(401, {
        //         'Content-Type': 'text/plain'
        //     })
        //     res.end("NO_USER");
        // }
    })
});

router.post('/', async function (req, res) {
    // const userId = localStorage.getItem('userId');

    // console.log(req.body)
    let updatedUserDetails = `CALL updateUserInfo('${req.body.userId}','${req.body.name}','${req.body.email}','${req.body.currency}','${req.body.language}','${req.body.phone}','${req.body.timeZone}');`

    sql.query(updatedUserDetails, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({message : err}));
        }
        console.log(result)
        if (result.affectedRows > 0) {
            res.status(200).end("Profile Updated")
        }
        else {
            console.log("Error")
            res.writeHead(401, {
                'Content-Type': 'application/json'
            })
            // res.status(401).end("Error")
            res.end(JSON.stringify({message : "Error in Data"}));
        }
    })
});


module.exports = router;