import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import multer from "multer";
import Member from "../models/member";
import _ from "lodash";
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
const uploader = multer({
    storage: storage
});

router.route("/landingpagestats").get((req, res) => {
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

router.route("/").get((req, res) => {
    Member.find({}).populate('referer').populate('musictype').populate('favouriteartists').populate('favouritefestivals').sort({
        'createdAt': 'desc'
    }).exec((err, docs) => {
        if (err) {
            console.error(err);
            res.status(400).send("Failed to get members", err);
        } else res.json(docs);
    });
});


router.route("/:id").get((req, res) => {
    Member.findById(req.params.id).populate('referer').populate('musictype').populate('favouriteartists').populate('favouritefestivals').exec((err, docs) => {
        if (err) res.status(400).send("Failed to get member");
        else res.json(docs);
    });
});

router.route("/bysocialid/:id").get((req, res) => {
    Member.findOne({
        socialid: req.params.id
    }).populate('referer').populate('musictype').populate('favouriteartists').populate('favouritefestivals').exec((err, docs) => {
        if (err) res.status(400).send("Failed to get bysocialid");
        else res.json(docs);
    });
});

router.route("/add").post((req, res) => {
    let member = new Member(req.body.member);
    karmicKudosCheck(member, req.body.member.referer, false);
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


router.route("/update/:id").post((req, res, next) => {
    // console.log('updating ', req.body.member.uname)
    let member = new Member(req.body.member);

    karmicKudosCheck(member, req.body.member.referer, true);
    if (!mongoose.Types.ObjectId.isValid(member.referer)) {
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

router.route("/delete/:id").get((req, res) => {
    Member.findByIdAndDelete({
        _id: req.params.id
    }, (err, member) => {
        if (err) res.json(err);
        else res.json("Removed successfully");
    });
});

router.route("/add/avatar").post(uploader.array('files'), (req, res) => {
    Member.findOneAndUpdate({
        _id: req.body.id
    }, {
        avatarUrl: `http://www.psytranceismyreligion.com:3001/${req.files[0].filename}`
    }, {
        new: true,
        upsert: false
    }, (err, member) => {
        if (err) throw (err);
        else
            res.json(member);
    });
});

router.route("/message/:id").post((req, res) => {
    // console.log('received message ', req.body.message);
    sendMessage(req.body.message);
    res.status(200);
});


function karmicKudosCheck(member, referer, updateMode) {
    if (updateMode && member.referer) {
        Member.findById(member._id).populate('referer').exec((err, checkMember) => {
            if (!checkMember.referer) {
                updateKarmicKudos(referer);
            };
        });
    } else {
        updateKarmicKudos(referer);
    }

}

function updateKarmicKudos(referer) {
    console.log('updating Karmic Kudos for: ', referer.uname)
    if (referer) {
        Member.findOneAndUpdate({
            _id: referer._id
        }, {
            karmicKudos: referer.karmicKudos + 10
        }, {
            upsert: false
        }, (err, res) => {
            if (err) throw (err);
        });
    }

}

async function sendMessage(message) {
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'psytranceismyreligion@googlemail.com',
            pass: process.env.SMTP_PWD
        }
    }));
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Psytrance Is My Religion" <psytranceismyreligion@gmail.com>',
        to: message.receiver.email,
        subject: 'Message from Psytrance Is My Religion member ' + message.createdBy.uname + ': ' + message.title,
        html: message.content
    });
    console.log('Message sent: %s', info.messageId);
    let copy = await transporter.sendMail({
        from: '"Psytrance Is My Religion" <psytranceismyreligion@gmail.com>',
        to: message.createdBy.email,
        subject: 'Your copy of message to Psytrance Is My Religion member ' + message.createdBy.uname + ': ' + message.title,
        html: message.content
    });
}

export default router;