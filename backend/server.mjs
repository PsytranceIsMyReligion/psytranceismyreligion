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
import wallPostRoutes from "./routes/wallpost.routes";
import socketIO from "socket.io";
import nodeCache from "node-cache";
import path from "path";
import {
  dirname
} from 'path';
import {
  fileURLToPath
} from 'url';

import {
  resolve
} from "path";
import dotenv from 'dotenv';
import NodeCache from "node-cache";


const __dirname = dirname(fileURLToPath(
  import.meta.url));
dotenv.config(
  ({
    path: resolve(__dirname, ".env")
  }));


const app = express();
const router = express.Router();
const messageCache = new NodeCache({
  stdTTL: 100,
  checkperiod: 120
});
messageCache.set("messages", []);
app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200'
}));
app.use(express.static('public'));
// app.use('/static', express.static(path.join(__dirname, 'public')))
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
      "/members/add/avatar",
      "/wallposts",
      "/static",
      "/images",
      "/public/*",
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
app.use('/wallposts', wallPostRoutes);

router.route("/api/auth").post((req, res) => {
  var token = jwt.sign({
    id: req.body.id
  }, secretConfig.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  console.log(req.body)
  io.emit('system-message', req.body.name + ' has logged on!');
  res.status(200).send({
    token: token
  });
});

app.use("/", router);
const server = app.listen(process.env.PORT, () => console.log("express server running on port " + process.env.PORT));
const io = socketIO(server);

const connections = new Set();
io.on('connection', (socket) => {
  connections.add(socket);
  console.log('socket.io connected');
  io.on('system-message', (message) => {
    console.log('system-message', message);
    io.emit('system-message', message);
  });


  socket.on('chat-init', (null, () => {
    let values = messageCache.get("messages");
    if (values)
      values.map(el => socket.emit('chat-init', el));
  }).bind(messageCache));

  socket.on('logoff', (err, member) => {
    console.log("logoff", member)
    if (member) {
      console.log('l', member.name)
      io.emit("system-message", member.name + " logged off");
    }
  })


  socket.on('chat-message', (null, (message) => {
    let values = messageCache.get("messages");
    if (values)
      messageCache.set("messages", [message, ...values]);
    else
      messageCache.set("messages", [message]);
    socket.broadcast.emit('chat-message', message);
  }).bind(messageCache));
  socket.on('disconnect', function (member) {
    connections.delete(socket);
  });

});