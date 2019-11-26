import StaticData from "../models/staticdata";
import multer from "multer";

import express from "express";
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
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
        res.status(500).json({
            "uploaded": false,
            "error": {
                "message": "could not upload this image"
            }
        });
    }
    let imgUrl = "https://www.psytranceismyreligion.com/api/public/" + file.filename;
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
        console.log('Error getting static data', err);
    });
});

router.route("/add").post((req, res) => {
    // console.log('adding ', req.body)
    let staticData = new StaticData(req.body);
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