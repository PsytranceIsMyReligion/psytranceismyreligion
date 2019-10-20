import express from "express";
import cors from "cors";
import expressJwt from "express-jwt";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";
import videoRoutes from "./routes/video.routes";
import staticDataRoutes from "./routes/staticdata.routes";
import wallPostRoutes from "./routes/wallpost.routes";
import socketIO from "socket.io";
import path from "path";
import _ from "lodash";
import Member from "./models/member";
import LoginRecord from "./models/loginrecord";
import forceHTTPS from './utils';
import https from 'https';
import fs from 'fs';


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

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

dotenv.config({
  path: resolve(__dirname, ".env")
});
console.log('__dirname', __dirname);
const app = express();

const router = express.Router();



////////////////////// Cache Config ////////////////////////////
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



///////////////////////////////////     App Config  /////////////////////////////
app.use(
  cors({
    credentials: true,
    origin: [
      "http://127.0.0.1:3000",
      "http://localhost:4200",
      "http://localhost:3000",
      "http://www.psytranceismyreligion.com",
      "https://www.psytranceismyreligion.com",
      // "http://ec2-3-10-86-129.eu-west-2.compute.amazonaws.com",
      // "https://ec2-3-10-86-129.eu-west-2.compute.amazonaws.com",
      "https://www.psytranceismyreligion.com",
      "wss://www.psytranceismyreligion.com",
      "https://psytranceismyreligion.com"
    ]
  })
);


app.use('/api/public', express.static(path.join(__dirname, "public")));
console.log("setting public folder to ", path.join(__dirname, "public"));
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
      "/api/socket.io/*",
      "/socket.io/*",
      "/api/auth",
      "/api/members",
      "/api/members/add",
      "/api/members/add/avatar",
      "/api/members/landingpagestats",
      /\/api\/members\/bysocialid\/.*/,
      /\/api\/staticdata\/*/,
      /\/api\/upload\/*/,
      /\/api\/public\/*/,
    ]
  })
);
if (isProd) {
  console.log('forcing use of https');
  app.use(forceHTTPS());
}
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

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/staticdata", staticDataRoutes);
app.use("/api/wallposts", wallPostRoutes);



app.use("/", router);
const server = app.listen(process.env.PORT, () =>
  console.log("express server running on port " + process.env.PORT)
);

const secureServer = https.createServer({
  key: fs.readFileSync(isProd ? process.env.SSL_KEY_PATH_PROD : process.env.SSL_KEY_PATH_DEV),
  cert: fs.readFileSync(isProd ? process.env.SSL_CRT_PATH_PROD : process.env.SSL_CRT_PATH_DEV),
  passphrase: process.env.HTTPS_PASSPHRASE || 'psytrance'
});

/////////////////////    Socket IO Config ////////////////////////
const io = socketIO(server, {
  origins: '*:*',
  transports: ['websocket']
});
// const io = socketIO(isProd ? secureServer : server, {
//   origins: '*:*',
//   transports: ['websocket']
// });

const connections = new Set();

io.on("connection", socket => {
  connections.add(socket);
  socket.on(
    "chat-init",
    (null,
      () => {
        let values = messageCache.get("messages");
        if (values) values.map(el => socket.emit("chat-init", el));
      }).bind(messageCache)
  );

  setInterval(() => {
    io.emit('logged-on-users', loggedOnUserCache.get("users").filter(el => el));
  }, 600000); // 10 mins


  socket.on("get-logged-on-users", (null,
    async (user) => {
      console.log("geting logged on users");
      if (user._id && loggedOnUserCache.get("users").filter(u => u._id == user._id).length > 0) {
        socket.emit("system-message", "Welcome back " + user.uname + "! There are " +
          loggedOnUserCache.get("users").length > 1 ? loggedOnUserCache.get("users").length + " other members online. Why not say Hello? " : "");
      } else {
        socket.emit("system-message", "Welcome back " + user.uname + "!");
      }
      // isProd ?
      loggedOnUserCache.set("users", [user._id, ...loggedOnUserCache.get("users").filter(el => el != user._id)])
      //  : loggedOnUserCache.set("users", [user._id, ...loggedOnUserCache.get("users")]);

      Member.logon(user);
      let loginRecord = new LoginRecord({
        memberId: user._id
      });
      loginRecord = await loginRecord.save();
      socket.emit("login-record", loginRecord);
      socket.broadcast.emit("system-message", user.uname + " has logged on!");
      socket.emit("logged-on-users", loggedOnUserCache.get("users").filter(el => el));
    }).bind(loggedOnUserCache));

  socket.on("logoff", (null, async (loginRecord) => {
    if (loginRecord) {
      loginRecord = await LoginRecord.logoff(loginRecord);
      isProd ? loggedOnUserCache.set("users", [...loggedOnUserCache.get("users").filter(el => el != loginRecord.memberId)]) :
        loggedOnUserCache.set("users", [...loggedOnUserCache.get("users")]);

      let member = await Member.findMemberById(loginRecord.memberId);
      if (member) {
        socket.broadcast.emit("system-message", member.uname + " logged off");
      }
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