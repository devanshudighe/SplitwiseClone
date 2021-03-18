var express = require('express');
var router = express.Router();
var sql = require('../sql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// multer options
// const upload = multer({
//     // type : Buffer,
//     dest: 'images'
//     })
const userstorage = multer.diskStorage({
    destination: path.join(__dirname, '..') + '\\images\\',
    filename: (req, file, cb) => {
        cb(null, 'user' + req.body.userId + "-" + Date.now() + path.extname(file.originalname));
    }
});
const useruploads = multer({
    storage: userstorage,
    limits: { fileSize: 1000000 },
}).single("image");

router.get('/:userImage', (req, res) => {
            var image = path.join(__dirname, '..') + '/images/' + req.params.userImage;
            // console.log(image)
            if (fs.existsSync(image)) {
                // res.set('Content-Type', 'image/jpg')
                res.sendFile(image)
                // res.sendFile(image);
            }
            else {
                res.sendFile(path.join(__dirname, '..') + '/images/userplaceholder.png')
            }
});    


router.post("/", (req, res) => {
    useruploads(req, res, function (err) {
        if (!err) {
            console.log(req)
            let imageSql = `UPDATE UserDetails SET imageInfo = '${req.file.filename}' WHERE user_id = ${req.body.userId}`;
            sql.query(imageSql, (err, result) => {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Database Error");
                }
            });
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(req.file.filename);
        }
        else {
            console.log(JSON.stringify(err))
            console.log('Error!');
        }
    })
});
// router.post('/', upload.single('upload'), (req, res) => {
//     var image = req.file.buffer
//     image.save()
//     res.send()
//     console.log(res)
//     }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })

module.exports = router;