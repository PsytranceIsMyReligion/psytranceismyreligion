import mongoose, { STATES } from 'mongoose';

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    socialid : {
        type : Number
    },
    fname : {
        type : String
    },
    lname : {
        type : String
    },
    gender : {
        type : String
    },
    email : {
        type : String
    },
    birthyear : {
        type : Number
    },
    origin : {
        type : String
    },
    postcode : {
        type : String
    },
    lat : {
        type : Number
    },
    long : {
        type : Number
    },
    reason : {
        type : String
    },
    psystatus : {
        type : String,
    }
});


export default mongoose.model('User', UserSchema);