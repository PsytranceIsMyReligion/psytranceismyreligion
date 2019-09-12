import express from "express";
const router = express.Router();
import Video from "../models/videos";
import mongoose from "mongoose";

router.route("/").get((req, res) => {
  Video.find({}).populate('createdBy').sort({
    'createdAt': 'desc'
  }).exec((err, docs) => {
    if (err) res.status(400).send("Failed to get videos");
    else res.json(docs);
  });
});

router.route("/add").post((req, res) => {
  let video = new Video(req.body);
  video
    .save()
    .then(video => {
      res.status(200).json(video);
    })
    .catch(err => {
      console.log('error', err);
      res.status(400).send("Failed to create a new video");
    });
})

router.route("/update/:id").post((req, res, next) => {
  console.log('updating ', req.body);
  Video
    .updateOne(req.body)
    .then(video => {
      res.status(200).json(video);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Update video failed");
    });
});

router.route("/delete/:id").get((req, res) => {
  Video.findByIdAndDelete({
    _id: req.params.id
  }, (err, video) => {
    if (err) res.json(err);
    else res.json("Removed successfully");
  });
});

export default router;