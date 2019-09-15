import express from "express";
const router = express.Router();
import mongoose from "mongoose";

import Member from "../models/member";
import _ from "lodash";

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
    Member.find({}).populate('referer').populate('musictype').populate('favouriteartists').sort({
        'createdAt': 'desc'
    }).exec((err, docs) => {
        if (err) {
            console.error(err);
            res.status(400).send("Failed to get members", err);
        } else res.json(docs);
    });
});


router.route("/:id").get((req, res) => {
    Member.findById(req.params.id).populate('referer').populate('musictype').populate('favouriteartists').exec((err, docs) => {
        if (err) res.status(400).send("Failed to get member");
        else res.json(docs);
    });
});

router.route("/bysocialid/:id").get((req, res) => {
    Member.findOne({
        socialid: req.params.id
    }).populate('referer').populate('musictype').populate('favouriteartists').exec((err, docs) => {
        if (err) res.status(400).send("Failed to get bysocialid");
        else res.json(docs);
    });
});

router.route("/add").post((req, res) => {
    let member = new Member(req.body);
    karmicKudosCheck(member, req.body.referer, false);
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

    let member = new Member(req.body);

    karmicKudosCheck(member, req.body.referer, true);
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

function karmicKudosCheck(member, referer, updateMode) {
    if (updateMode && member.referer) {
        Member.find({
            _id: member.id
        }).populate('referer').exec((err, checkMember) => {
            if (!checkMember.referer) {
                updateKarmicKudos(referer);
            };
        });
    } else {
        updateKarmicKudos(referer);
    }

}

function updateKarmicKudos(referer) {
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

export default router;