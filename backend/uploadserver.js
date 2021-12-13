const express = require('express');
// const S3= require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multer  = require('multer')
// const fileUpload = require('express-fileupload');
const upload = multer({ dest: 'uploads/' })

const app = express();

// var app = express()
var cors = require('cors');
var bodyParser = require("body-parser");

//express-fileupload - Simple Express middleware for uploading files. It parses multipart/form-data requests, 
//extracts the files if available, and make them available under req.files property.

// enable files upload
// app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const AWS_Access_key_ID = 'AKIARVU4L5UPWLA2L2VH';
const AWS_Secret_Access_key = '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';
const BUCKET_NAME = 'cakeimageupload';

const s3 = new AWS.S3({
    accessKeyId: AWS_Access_key_ID,
    secretAccessKey: AWS_Secret_Access_key,
    region:'ap-southeast-2'
});



// app.get("/check", (req, res) => {
//     res.json({'message': 'ok'});
// })


app.post("/uploadfile", upload.single('file'), (req, res) => {
    // console.log(req);
    console.log(req.file);
    if (req.file == null) {
        console.log("inside the first if")
        return res.status(400).json({ 'message': 'Please choose the file' })
    }

        var file = req.file
        // res.send(200);
        // res.sendStatus(201);
    
        const uploadImage=(file)=>{
            console.log("second if")  
            const fileStream = fs.createReadStream(file.path);

            const params = {
                Bucket: BUCKET_NAME,
                Key: file.originalname,
                Body: fileStream,
            };

            s3.upload(params, function (err, data) {
                console.log(data)
                if (err) {
                    throw err
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
        }
        uploadImage(file);
        return res.send(201)
})

// app.listen(3002);
app.listen(3002, () => {
    console.log("Server running on port 3002")
})

