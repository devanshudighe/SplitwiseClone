var express = require('express');
var router = express.Router();
var sql = require('../sql')
const passwordHash = require('password-hash');
//route to Login Page
// router.get('/login', function (req, res) {
//     //check if user session exits
//     if (req.session.user) {
//         res.status(200).send("In Dashboard")
//     } else{
//         res.status(200).send("Invalid Creds")
//         // invalidCredentials = false
//         // res.st('login',{
//         //     invalidCredentials : invalidCredentials
//         // });
//     }
        
// });
// var invalidCredentials = false
router.post('/', async function (req, res) {
        // console.log("Req Body : ", req.body);
        let userDetails = `CALL getUserInfo('${req.body.email}');`
        console.log("Inside Login Post" + userDetails)
        sql.query(userDetails, (err,result) => {
            if (err) {
                res.writeHead(500, {
                  'Content-Type': 'text/plain'
                });
                res.send("Database Error");
              }
            console.log("Result")
            console.log(result.length)
            if (result && result[0].length > 0){
                if (passwordHash.verify(req.body.password, result[0][0].password))
                {
                    let user = {
                        userId : result[0][0].user_id,
                        user_name : result[0][0].name,
                        email : result[0][0].email,
                        currency : result[0][0].currency,
                        language : result[0][0].language,
                        phone : result[0][0].phone,
                        timeZone : result[0][0].timeZone,
                        image : result[0][0].imageInfo
                    }
                    console.log(user)
                    res.status(200).send(user)
                }
                else{
                    res.status(401).end("Wrong Password")
                }
            }
            else {
                res.writeHead(401, {
                    'Content-Type': 'text/plain'
                })
                res.end("NO_USER");
            }
        })
});

module.exports = router;