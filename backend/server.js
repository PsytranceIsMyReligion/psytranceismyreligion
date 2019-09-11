import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import secretConfig from "./secret-config";
import memberRoutes from "./routes/member.routes";
import videoRoutes from "./routes/video.routes";
import staticDataRoutes from "./routes/staticdata.routes";
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
      "/static",
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
app.use('/static', staticDataRoutes);


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