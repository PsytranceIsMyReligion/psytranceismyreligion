import express from "express";
const router = express.Router();
import WallPost from "../models/wallpost";

router.route("/").get((req, res) => {
    WallPost.find({}).populate('createdBy').sort({
        'updatedAt': 'desc'
    }).exec((err, docs) => {
        if (err) res.status(400).send("Failed to get wallposts");
        else res.json(docs);
    });
});

router.route("/add").post((req, res) => {
    let post = new WallPost(req.body);
    post
        .save()
        .then(post => {
            console.log('saved', post)
            res.status(200).json(post);
        })
        .catch(err => {
            console.log('error', err);
            res.status(400).send("Failed to create a new post");
        });
})

router.route("/update/:id").post((req, res, next) => {
    WallPost
        .findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                title: req.body.title,
                content: req.body.content
            }
        }, {
            new: true
        }, (err, post) => {
            // console.log('updated', post)
            if (err) res.json(err);
            res.status(200).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("Update failed");
        });
});

router.route("/delete/:id").get((req, res) => {
    WallPost.findByIdAndDelete({
        _id: req.params.id
    }, (err, post) => {
        if (err) res.json(err);
        else res.json("Removed successfully");
    });
});

export default router;