import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import multer from "multer";
import Member from "../models/member";
import _ from "lodash";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { isUndefined } from "util";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  }
});
const uploader = multer({
  storage: storage,
  limits: {
    fileSize: 1048576
  } // 1MB = 1024 *1024
});

router.route("/landingpagestats").get((req, res) => {
  Member.countDocuments((err, count) => {
    if (err) res.json(err);
    Member.countDocuments(
      {
        psystatus: "religion"
      },
      (err, converts) => {
        let percentage = (converts / count) * 100;
        res.json({
          count: count,
          conversionPercent: Math.round(percentage)
        });
      }
    );
  });
});

router.route("/").get(async (req, res) => {
  let allMembers;
  try {
    allMembers = await Member.getAll();
  } catch (err) {
    console.error("Http error", err);
    return res.status(500).send();
  }
  res.json(allMembers);
});

router.route("/:id").get(async (req, res) => {
  let member;
  try {
    member = await Member.findByMemberId(req.params.id);
  } catch (err) {
    console.error("Http error", err);
    return res.status(500).send();
  }
  res.json(member);
});

router.route("/bysocialid/:id").get((req, res) => {
  Member.findOne({
    socialid: req.params.id
  })
    .populate("referer")
    .populate("favouriteartists")
    .populate("favouritefestivals")
    .exec((err, docs) => {
      if (err) res.status(400).send("Failed to get bysocialid");
      else res.json(docs);
    });
});

router.route("/add").post((req, res) => {
  console.log("adding", req.body.member.uname, req.body.member);
  let member = new Member(req.body.member);
  karmicKudosCheck(member, false);
  member
    .save()
    .then(member => {
      res.status(200).json(member);
    })
    .catch(err => {
      console.log("error adding user", err);
      res.status(400).send(err);
    });
});

router.route("/update/:id").post((req, res, next) => {
  let member = new Member(req.body.member);
  karmicKudosCheck(member, true);
  member
    .updateOne(member)
    .then(member => {
      res.status(200).json(member);
    })
    .catch(err => {
      console.log("error updating user", err);
      res.status(400).send("Update failed");
    });
});

function karmicKudosCheck(member, updateMode) {
  if (!mongoose.Types.ObjectId.isValid(member.referer)) {
    member.referer = mongoose.Types.ObjectId();
    return;
  }
  if (updateMode && member.referer && member.referer._id) {
    Member.findById(member._id)
      .populate("referer")
      .exec((err, checkMember) => {
        if (!checkMember.referer) {
          Member.updateKarmicKudos(member.referer, 10);
        }
      });
  } else {
    console.log("member ref ", member.referer);
    if (member.referer) Member.updateKarmicKudos(member.referer, 10);
  }
}

router.route("/delete/:id").get((req, res) => {
  Member.findByIdAndDelete(
    {
      _id: req.params.id
    },
    (err, member) => {
      if (err) res.json(err);
      else res.json("Removed successfully");
    }
  );
});

router.route("/add/avatar").post(uploader.array("files"), (req, res) => {
  // console.log('adding avatar', 'https://www.psytranceismyreligion.com/api/public/' + req.files[0].filename);
  Member.findOneAndUpdate(
    {
      _id: req.body.id
    },
    {
      avatarUrl: `https://www.psytranceismyreligion.com/api/public/${req.files[0].filename}`
    },
    {
      new: true,
      upsert: false
    },
    (err, member) => {
      if (err) {
        console.log("error adding avatar", err);
        throw err;
      } else res.json(member);
    }
  );
});

router.route("/message/:id").post((req, res) => {
  let result = sendMessage(req.body.message);
  res.status(200).json(result);
});

async function sendMessage(message) {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "psytranceismyreligion@googlemail.com",
        pass: process.env.SMTP_PWD
      }
    })
  );
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Psytrance Is My Religion" <psytranceismyreligion@gmail.com>',
    to: message.receiver.email,
    cc: message.createdBy.email,
    subject:
      "Message from Psytrance Is My Religion member " +
      message.createdBy.uname +
      " [" +
      message.createdBy.email +
      "]: " +
      message.title,
    html: message.content
  });
  console.log("Message sent: %s", info.messageId);
  return info;
}

export default router;
