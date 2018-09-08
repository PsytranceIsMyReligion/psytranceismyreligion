import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Member from './models/member';
import config from './config';

const app = express();
const router = express.Router();
app.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/api/auth',
'/members','/members/landingpagestats', /^\/members\/bysocialid\/.*/]}));

mongoose.connect('mongodb://localhost:27017/members', {useNewUrlParser : true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Mongo db connected');
});



router.route('/members/landingpagestats').get((req, res) => {
    Member.estimatedDocumentCount((err, count) => {
        if(err)
            res.json(err);
            Member.estimatedDocumentCount({'psystatus' : 'religion'},(err, converts) => {
            let percentage = converts/count * 100;
            res.json({'count' : count, 'conversionPercent' : percentage});
        });
    });
});

router.route('/members').get((req, res ) => {
    Member.find((err, members) => {
        if(err)
            res.statusCode(400);
        else
            res.json(members);
    });
});

router.route('/api/auth').post((req, res)  => { 
    var token = jwt.sign({ id: req.body.socialid }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
    });
    console.log('token sent');
    res.status(200).send({ token: token });
});

router.route('/members/:id').get((req, res) => {
    Member.findById(req.params.id, (err, member) => {
        if(err)
            console.log(err);
        else
            res.json(member);
    });
});


router.route('/members/bysocialid/:id').get((req, res) => {
    Member.findOne({ 'socialid' : req.params.id }, (err, member) => {
        if(err)
            res.status(400).json(err);
        else {
              res.json(member);
        }
    });
});


router.route('/members/add').post((req, res) => {
    let member = new Member(req.body);
    member.save()
        .then(member => {
            res.status(200).json(member);
        })
        .catch(err => {
            res.status(400).send('Failed to create a new record');
        });
});

router.route('/members/update/:id').post((req, res, next) => {
    Member.findById(req.params.id, (err, member) => {
        if(!member)
             res.statusCode(400);
        else {
            member.fname = req.body.fname;
            member.lname = req.body.lname;
            member.gender = req.body.gender;
            member.birthyear = req.body.birthyear;
            member.postcode = req.body.postcode;
            member.origin = req.body.origin;
            member.psystatus = req.body.psystatus;
            member.lat = req.body.lat;
            member.long = req.body.long;
            member.membertype = req.body.membertype;
            member.musictype = req.body.musictype;
            member.startyear = req.body.startyear;
            member.bio = req.body.bio;
            member.favouriteparty = req.body.favouriteparty;
            member.partyfrequency = req.body.partyfrequency;
            member.favouritefestival = req.body.favouritefestival;
            member.festivalfrequency = req.body.festivalfrequency;
            member.facebookurl = req.body.facebookurl;
            member.soundcloudurl = req.body.soundcloudurl;
            member.websiteurl = req.body.websiteurl;
            member.reason = req.body.reason;
            member.save().then(member => {
                res.status(200).json(member);
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
    router.route('/members/delete/:id').get((req, res) => {
        Member.findByIdAndRemove({_id: req.params.id}, (err, member) => {
            if(err)
                res.json(err);
            else 
                res.json('Removed successfully');
        });
    });

});


app.use('/', router);
app.listen(4000, () => console.log('express server running'));