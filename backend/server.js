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
import memberRoutes from "./routes/member.routes";
import videoRoutes from "./routes/video.routes";

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

app.use('/members', memberRoutes);
app.use('/videos', videoRoutes);


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

app.use("/", router);
app.listen(process.env.PORT, () => console.log("express server running on port " + process.env.PORT));