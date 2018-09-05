import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './models/user';
import { runInNewContext } from 'vm';

const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/users');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Mongo db connected');
});

router.route('/users').get((req, res) => {
    User.find((err, users) => {
        if(err)
            console.log(err);
        else
            res.json(users);
    });
});

router.route('/users/:id').get((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err)
            console.log(err);
        else
            res.json(user);
    });
});


router.route('/users/bysocialid/:id').get((req, res) => {
    User.findOne({ 'socialid' : req.params.id }, (err, user) => {
        if(err)
            console.log(err);
        else
            res.json(user);
    });
});


router.route('/users/add').post((req, res) => {
    let user = new User(req.body);
    user.save()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send('Failed to create a new record');
        })
});

router.route('/users/update/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(!user)
            return next(new Error('Could not load document'));
        else {
            user.fname = req.body.fname;
            user.lname = req.body.lname;
            user.gender = req.body.gender;
            user.birthyear = req.body.birthyear;
            user.postcode = req.body.postcode;
            user.origin = req.body.origin;
            user.psystatus = req.body.psystatus;
            user.lat = req.body.lat;
            user.long = req.body.long;
            user.reason = req.body.reason;
            user.save().then(user => {
                res.status(200).json(user);

            }).catch(err => {
                res.status(400).send('Update failed');
            })
        }
    });
    router.route('/users/delete/:id').get((req, res) => {
        User.findByIdAndRemove({_id: req.params.id}, (err, user) => {
            if(err)
                res.json(err);
            else 
                res.json('Removed successfully')
        })
    })

});


app.use('/', router);
app.listen(4000, () => console.log('express server running'));