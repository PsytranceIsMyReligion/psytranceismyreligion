import StaticData from "../models/staticdata";
import multer from "multer";

import express from "express";
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
const uploader = multer({
    storage: storage
});


router.route("/upload").post(uploader.single('upload'), (req, res) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    let imgUrl = process.env.NODE_ENV === "production" ? "http://www.psytranceismyreligion.com:3001/" + file.filename : "http://localhost:3001/" + file.filename;
    let retVal = {
        "uploaded": true,
        "url": imgUrl
    };
    res.json(
        retVal
    )
});

router.route("/").get((rq, res) => {
    StaticData.find({}).sort({
        'name': 'asc'
    }).then(docs => {
        res.json(docs);
    }).catch((err) => {
        if (err) res.status(400).send("Failed to get static data");
        console.log('Error: ', err);
    });
});

router.route("/add").post((req, res) => {
    let staticData = new StaticData(req.body.params.value);
    staticData
        .save()
        .then(staticData => {
            res.status(200).json(staticData);
        })
        .catch(err => {
            console.error(err);
            res.status(400).send("Failed to create a new genre", err);
        });
});


export default router;