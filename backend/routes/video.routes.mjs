import express from "express";
const router = express.Router();
import Video from "../models/videos";
import WallPost from "../models/wallpost";
import Member from "../models/member";


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
    .then(updated => {
      addWallPost(req.body);
      res.status(200).json(updated);
    })
    .catch(err => {
      console.log('error', err);
      res.status(400).send("Failed to create a new video");
    });
})

router.route("/update/:id").post((req, res, next) => {
  Video
    .findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        value: req.body.value,
        tags: req.body.tags
      }
    }, {
      new: true
    }, (err, video) => {
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

function addWallPost(video) {
  let payload = {
    title: video.createdBy.uname + ' just uploaded ' + video.title + ' to the video library',
    content: '<iframe width="355" height="200" src="https://www.youtube.com/embed/' + video.value + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    createdBy: video.createdBy
  }
  let post = new WallPost(payload);
  post.save().then(saved => {
      Member.updateKarmicKudos(video.createdBy, 10);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Update post failed");
    });
}



export default router;