import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Member from "./models/member";
import MusicGenres from "./models/musicgenres";
import Video from "./models/videos";
import secretConfig from "./secret-config";
import {
  resolve
} from "path";
import {
  config
} from "dotenv";

config({
  path: resolve(__dirname, ".env")
});

const app = express();
const router = express.Router();
app.use(cors());
app.options("*", cors());
router.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(
  expressJwt({
    secret: "psytranceismyreligion-super-secret"
  }).unless({
    path: [
      "/api/auth",
      "/members",
      "/musicgenres",
      "/musicgenres/add",
      "/members/add",
      "/members/landingpagestats",
      /^\/members\/bysocialid\/.*/
    ]
  })
);

process.env.NODE_ENV == undefined ? process.env.NODE_ENV = "development" : null;
let dbUrl = process.env.NODE_ENV === "production" ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV;
console.log('Loading environment ' + process.env.NODE_ENV);
console.log('connecting to ' + dbUrl);
mongoose.connect(dbUrl, {
  useNewUrlParser: true
});


const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo db connected");
});

router.route("/members/landingpagestats").get((req, res) => {
  Member.countDocuments((err, count) => {
    if (err) res.json(err);
    Member.countDocuments({
      psystatus: "religion"
    }, (err, converts) => {
      let percentage = (converts / count) * 100;
      res.json({
        count: count,
        conversionPercent: Math.round(percentage)
      });
    });
  });
});

router.route("/members").get((req, res) => {
  Member.find({}).sort({
    'fname': 'asc'
  }).exec((err, docs) => {

    if (err) res.status(400).send("Failed to get members");
    else res.json(docs);
  });
});


router.route("/videos").get((req, res) => {
  Video.find({}).populate('createdBy').sort({
    'order': 'asc'
  }).exec((err, docs) => {
    if (err) res.status(400).send("Failed to get videos");
    else res.json(docs);
  });
});

router.route("/videos/add").post((req, res) => {
  let video = new Video(req.body);
  console.log('saving', video)
  video
    .save()
    .then(video => {
      video.findOneAndUpdate({ _id: video._id }, { $inc: { order: 1 } }, {new: true },function(err, response) {
        if (err) {
        callback(err);
       } else {
        callback(response);
       }
      res.status(200).json(video);
    })})
    .catch(err => {
      res.status(400).send("Failed to create a new video");
    });
});


router.route("/videos/delete/:id").get((req, res) => {
  Video.findByIdAndDelete({
    _id: req.params.id
  }, (err, video) => {
    if (err) res.json(err);
    else res.json("Removed successfully");
  });
});


router.route("/musicgenres").get((req, res) => {
  MusicGenres.find({}).sort({
    'name': 'asc'
  }).exec((err, docs) => {
    if (err) res.statusCode(400);
    else res.json(docs);
  });
});


router.route("/musicgenres/add").post((req, res) => {
  let genre = new MusicGenres(req.body);
  genre
    .save()
    .then(genre => {
      res.status(200).json(genre);
    })
    .catch(err => {
      res.status(400).send("Failed to create a new genre");
    });
});

router.route("/api/auth").post((req, res) => {
  var token = jwt.sign({
    id: req.body.id
  }, secretConfig.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({
    token: token
  });
});

router.route("/members/:id").get((req, res) => {
  Member.findById(req.params.id, (err, member) => {
    if (err) console.log(err);
    else res.json(member);
  });
});

router.route("/members/bysocialid/:id").get((req, res) => {
  Member.findOne({
    socialid: req.params.id
  }, (err, member) => {
    if (err) res.status(400).json(err);
    else {
      res.json(member);
    }
  });
});

router.route("/members/add").post((req, res) => {
  let member = new Member(req.body);
  member.createdDate = new Date();
  member.updatedDate = new Date();
  member
    .save()
    .then(member => {
      res.status(200).json(member);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

router.route("/members/update/:id").post((req, res, next) => {
  Member
    .updateOne(req.body)
    .then(member => {
      res.status(200).json(member);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Update failed");
    });
});

router.route("/members/delete/:id").get((req, res) => {
  Member.findByIdAndDelete({
    _id: req.params.id
  }, (err, member) => {
    if (err) res.json(err);
    else res.json("Removed successfully");
  });
});

app.use("/", router);
app.listen(process.env.PORT, () => console.log("express server running on port " + process.env.PORT));