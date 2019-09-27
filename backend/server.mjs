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
      "http://localhost:4200",
      "http://localhost:3000",
      "http://ec2-3-8-187-23.eu-west-2.compute.amazonaws.com:3000",
      "http://www.psytranceismyreligion.com"
    ]
  })
);



// app.use(express.static("public"));
express.static(path.join(__dirname, "public"));
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
      "/auth",
      "/members",
      "/members/add",
      "/members/add/avatar",
      "/members/landingpagestats",
      /\/members\/bysocialid\/.*/,
      /\/staticdata\/*/,
      /\/upload\/*/,

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

app.use("/auth", authRoutes);
app.use("/members", memberRoutes);
app.use("/videos", videoRoutes);
app.use("/staticdata", staticDataRoutes);
app.use("/wallposts", wallPostRoutes);



app.use("/", router);
const server = app.listen(process.env.PORT, () =>
  console.log("express server running on port " + process.env.PORT)
);


/////////////////////    Socket IO Config ////////////////////////

const io = socketIO(server);

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
      console.log("logging off user - record", loginRecord);
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