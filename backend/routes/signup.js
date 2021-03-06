var express = require('express');
var router = express.Router();
var sql = require('../sql')
const passwordHash = require('password-hash');
// Signup page
// var duplicateUser = false
// router.get('/signup', function (req, res) {
//     if (req.session.user) {
//         res.redirect('/dashboard');
//     } else {
//         duplicateUser = false
//         res.send('signup', {
//             duplicateUser: duplicateUser
//         });
//     }
// });


router.post('/', async function (req, res) {
    console.log("Signup post req");
    var hashedPassword = passwordHash.generate(req.body.password);
    console.log(hashedPassword)
    let details = `CALL storeUserInfo('${req.body.email}','${req.body.user_name}','${hashedPassword}');`

    sql.query(details, (err,result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end("Database Error");
            }
        console.log(result)
        if(result && result.length > 0 && result[0][0].flag){
            res.writeHead(200, {
                'Content-Type': 'text/plain' 
                });
            res.end("User is Added");
        }
        else if(result && result.length > 0 && !result[0][0].flag){
            res.writeHead(500, {
                'Content-Type': 'text/plain'
                });
            res.end("User Already Exists");
        }
        else{
            res.writeHead(401, {
                'Content-Type': 'text/plain'
            })
            res.end("NO_DATA");
        }
    })
});

module.exports = router;