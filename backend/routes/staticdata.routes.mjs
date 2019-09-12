import MusicGenre from "../models/musicgenres";
import Artist from "../models/artists";

import express from "express";
const router = express.Router();


router.route("/").get((rq, res) => {
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
        if (err) res.status(400).send("Failed to get static data");
        console.log('Error: ', err);
    });
});

router.route("/add").post((req, res) => {
    console.log('adding', req.body.params)
    if (req.body.params.type == 'musictype') {
        let genre = new MusicGenre(req.body.params.value);
        genre
            .save()
            .then(genre => {
                console.log('genre', genre)
                res.status(200).json(genre);
            })
            .catch(err => {
                console.error(err);
                res.status(400).send("Failed to create a new genre", err);
            });
    } else if (req.body.params.type == 'artist') {
        let artist = new Artist(req.body.params.value);
        artist.save()
            .then(artist => {
                console.log('artist', artist)
                res.status(200).json(artist);
            })
            .catch(err => {
                console.error(err);
                res.status(400).send("Failed to create a new artist", err);
            });
    }

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
export default router;