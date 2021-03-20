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
const groupstorage = multer.diskStorage({
    destination: path.join(__dirname, '..') + '\\groupImages\\',
    filename: (req, file, cb) => {
        cb(null, 'group' + req.params.groupName + "-" + Date.now() + path.extname(file.originalname));
    }
});
const groupuploads = multer({
    storage: groupstorage,
    limits: { fileSize: 1000000 },
}).single("image");

router.get('/:groupImage', (req, res) => {
            var image = path.join(__dirname, '..') + '\\groupImages\\' + req.params.groupImage;
            console.log(image)

            if (fs.existsSync(image)) {
                // res.set('Content-Type', 'image/jpg')
                res.sendFile(image)
                // res.sendFile(image);
            }
            else {
                res.sendFile(path.join(__dirname, '..') + '/images/userplaceholder.png')
            }
});  


router.post("/:groupName", (req, res) => {
    groupuploads(req, res, function (err) {
        if (!err) {
            
            let imageSql = `UPDATE GroupInfo SET group_image = '${req.file.filename}' WHERE group_name = '${req.params.groupName}'`;
            console.log(imageSql)
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

module.exports = router;