import StaticData from "../models/staticdata";

import express from "express";
const router = express.Router();


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