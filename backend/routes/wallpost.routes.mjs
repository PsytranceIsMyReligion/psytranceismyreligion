import express from "express";
const router = express.Router();
import WallPost from "../models/wallpost";

router.route("/").get((req, res) => {
    WallPost.find({}).populate('createdBy').populate('comments.createdBy').populate('likes').sort({
        'updatedAt': 'desc'
    }).exec((err, docs) => {
        if (err) {
            console.log('error', err)
            res.status(400).send("Failed to get wallposts");
        } else res.json(docs);
    });
});

router.route("/add").post((req, res) => {
    let post = new WallPost(req.body);
    post
        .save()
        .then(post => {
            WallPost.findOne({
                _id: post._id
            }).populate('createdBy').exec((err, docs) => {
                res.status(200).json(docs);
            });
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
                content: req.body.content,
                likes: req.body.likes,
                comments: req.body.comments
            }
        }, {
            new: true
        }, (err, post) => {
            WallPost.findOne({
                _id: post._id
            }).populate('createdBy').populate('comments.createdBy').populate('likes').exec((err, docs) => {
                console.log('returning', docs)
                res.status(200).json(docs);
            });
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