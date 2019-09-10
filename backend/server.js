import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Member from "./models/member";
import MusicGenre from "./models/musicgenres";
import Video from "./models/videos";
import Artist from "./models/artists";
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
      "/members/add",
      "/staticdata",
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
  Member.find({}).populate('referer').sort({
    'createdAt': 'desc'
  }).exec((err, docs) => {
    if (err) {
      console.log('Failed to get members', err)
      res.statusCode(400);
    } 
    else res.json(docs);
  });
});

router.route("/staticdata").get((rq, res) => {
  Promise.all([
    MusicGenre.find({}).sort({
      'name': 'asc'
    }),
    Artist.find({}).sort({
      'name': 'asc'
    })
  ]).then(docs => {
    res.json(docs);
  }).catch((err) => {
    if (err) res.status(400).send("Failed to get videos");
    console.log('Error: ', err);
  });
});


router.route("/videos").get((req, res) => {
  Video.find({}).populate('createdBy').sort({
    'createdAt': 'desc'
  }).exec((err, docs) => {
    if (err) res.status(400).send("Failed to get videos");
    else res.json(docs);
  });
});
 
router.route("/videos/add").post((req, res) => {
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

router.route("/videos/update/:id").post((req, res, next) => {
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

router.route("/videos/delete/:id").get((req, res) => {
  Video.findByIdAndDelete({
    _id: req.params.id
  }, (err, video) => {
    if (err) res.json(err);
    else res.json("Removed successfully");
  });
});


router.route("/musicgenre").get((req, res) => {
  MusicGenre.find({}).sort({
    'name': 'asc'
  }).exec((err, docs) => {
    if (err) res.statusCode(400);
    else res.json(docs);
  });
});


router.route("/musicgenre/add").post((req, res) => {
  let genre = new MusicGenre(req.body);
  genre
    .save()
    .then(genre => {
      res.status(200).json(genre);
    })
    .catch(err => {
      res.status(400).send("Failed to create a new genre");
    });
});

router.route("/artist/add").post((req, res) => {
  let artist = new Artist(req.body);
  artist
    .save()
    .then(artist => {
      res.status(200).json(artist);
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
  Member.findById(req.params.id).populate('referer').exec((err, docs) => {
    if (err) res.status(400).send("Failed to get member");
    else res.json(docs);
  });
});

router.route("/members/bysocialid/:id").get((req, res) => {
  Member.findOne({
    socialid: req.params.id
  }).populate('referer').exec((err, docs) => {
    if (err) res.status(400).send("Failed to get bysocialid");
    else res.json(docs);
  });
});

router.route("/members/add").post((req, res) => {
  let member = new Member(req.body);
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
  let member = new Member(req.body);
  // console.log('oid', mongoose.Types.ObjectId.isValid(member.referer));
  console.log('updating', member)
  if( mongoose.Types.ObjectId.isValid(member.referer)) {
    member.referer = mongoose.Types.ObjectId();
  }
  member
    .updateOne(member)
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