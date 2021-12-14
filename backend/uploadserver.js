const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();

var cors = require('cors');
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region:region
});



// app.get("/check", (req, res) => {
//     res.json({'message': 'ok'});
// })


app.post("/uploadfile", upload.single('file'), (req, res) => {
    console.log(req.file);
    if (req.file == null) {
        console.log("inside the first if")
        return res.status(400).json({ 'message': 'Please choose the file' })
    }

        var file = req.file
        const uploadImage=(file)=>{
            console.log("second if")  
            const fileStream = fs.createReadStream(file.path);

            const params = {
                Bucket: bucketName,
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
        return res.send(200)
})

// app.listen(3002);
app.listen(3002, () => {
    console.log("Server running on port 3002")
})

