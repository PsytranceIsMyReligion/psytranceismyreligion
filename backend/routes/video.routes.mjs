import express from "express";
const router = express.Router();
import Video from "../models/videos";
import WallPost from "../models/wallpost";


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
  let video = new Video(req.body);
  Video
    .findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        title: req.body.title,
        description: req.body.description,
        value: req.body.value,
      }
    }, {
      new: true
    }, (err, post) => {
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
    title: video.title,
    content: video.createdBy.uname + ' uploaded a link ' + video.description + ' ' + '<a target="_blank" href="http://www.youtube.com/watch?v=' + video.value + '">Link</a><br/><br/>',
    createdBy: video.createdBy
  }
  console.log('creating ', payload);
  let post = new WallPost(payload);
  post.save().then(saved => {
      console.log('saved log', saved);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Update post failed");
    });
}

export default router;