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
import _ from "lodash";

import {
  dirname
} from "path";
import {
  fileURLToPath
} from "url";

import {
  resolve
} from "path";
import dotenv from "dotenv";
import NodeCache from "node-cache";

const __dirname = dirname(fileURLToPath(
  import.meta.url));
const isProd = process.env.NODE_ENV === "production";
console.log("isProduction?", isProd);


dotenv.config({
  path: resolve(__dirname, ".env")
});
console.log('__dirname', __dirname);
const app = express();
const router = express.Router();
const messageCache = new NodeCache({
  stdTTL: 100,
  checkperiod: 120
});
const loggedOnUsersCache = new NodeCache({
  stdTTL: 0,
});
loggedOnUsersCache.set("users", []);
messageCache.set("messages", []);
const loggedOnUserCache = new NodeCache({
  stdTTL: 0,
  checkperiod: 120
});
loggedOnUserCache.set("users", []);
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:4200",
      "http://localhost:3000",
      "http://ec2-3-8-187-23.eu-west-2.compute.amazonaws.com:3000",
      "http://www.psytranceismyreligion.com"
    ]
  })
);
app.use(express.static("public"));
app.use("/static", express.static(path.join(__dirname, "public")));
app.options("*", cors());
router.use(
  bodyParser.urlencoded({
    limit: "16mb",
    extended: true
  })
);
app.use(
  bodyParser.json({
    limit: "16mb",
    extended: true
  })
);
app.use(
  expressJwt({
    secret: "psytranceismyreligion-super-secret"
  }).unless({
    path: [
      "/api/auth",
      "/members",
      "/members/add",
      "/members/add/avatar",
      "/members/landingpagestats",
      "/wallposts",
      "/videos",
      /\/members\/bysocialid\/.*/,
      /\/staticdata\/*/,
      /\/static\/*/,
      /\/public\/*/,
      // /\/member\/*/  
    ]
  })
);

let dbUrl = process.env.NODE_ENV === "production" ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV;
console.log("Loading environment " + process.env.NODE_ENV);
console.log("connecting to " + dbUrl);
mongoose.connect(dbUrl, {
  useNewUrlParser: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo db connected");
});

app.use("/members", memberRoutes);
app.use("/videos", videoRoutes);
app.use("/staticdata", staticDataRoutes);
app.use("/wallposts", wallPostRoutes);

router.route("/api/auth").post((req, res) => {
  var token = jwt.sign({
      id: req.body.id
    },
    secretConfig.secret, {
      expiresIn: 86400 // expires in 24 hours
    }
  );
  console.log(req.body);
  if(!_.includes(loggedOnUsersCache.get("users"), req.body.id))
    loggedOnUsersCache.set("users", [req.body.id, ...loggedOnUsersCache.get("users")]);
  io.emit("system-message", req.body.name + " has logged on!");
  res.status(200).send({
    token: token
  });
});

app.use("/", router);
const server = app.listen(process.env.PORT, () =>
  console.log("express server running on port " + process.env.PORT)
);
const io = socketIO(server);

const connections = new Set();

io.on("connection", socket => {
  connections.add(socket);
  io.on("system-message", message => {
    console.log("system-message", message);
    io.emit("system-message", message);
  });

  socket.on(
    "chat-init",
    (null,
      () => {
        let values = messageCache.get("messages");
        if (values) values.map(el => socket.emit("chat-init", el));
      }).bind(messageCache)
  );

  socket.on("get-logged-on-users", (null,
    (user) => {
      console.log('user', user)
      isProd ?
        loggedOnUserCache.set("users", [user._id, ...loggedOnUserCache.get("users").filter(el => el != user._id)]) :
        loggedOnUserCache.set("users", [user._id, ...loggedOnUserCache.get("users")]);
      console.log("getting users")
      io.emit("logged-on-users", loggedOnUserCache.get("users").filter(el => el));
    }).bind(loggedOnUserCache));

  socket.on("logoff", (null, (member) => {
    console.log("logoff", member);
    isProd ? loggedOnUserCache.set("users", [...loggedOnUserCache.get("users").filter(el => el != member._id)]) :
      loggedOnUserCache.set("users", [...loggedOnUserCache.get("users")]);


    if (member) {
      io.emit("system-message", member.uname + " logged off");
    }
  }).bind(loggedOnUserCache));

  socket.on(
    "chat-message",
    (null,
      message => {
        let values = messageCache.get("messages");
        if (values) messageCache.set("messages", [message, ...values]);
        else messageCache.set("messages", [message]);
        socket.broadcast.emit("chat-message", message);
      }).bind(messageCache)
  );
  socket.on("disconnect", () => {
    connections.delete(socket);
  });
});