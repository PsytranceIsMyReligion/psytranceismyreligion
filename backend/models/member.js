import mongoose from "mongoose";
import validator from "validator";
import Artist from "./artists";
import MusicGenre from "./musicgenres";


const Schema = mongoose.Schema;

let MemberSchema = new Schema({

  socialid: {
    type: Number
  },
  uname: {
    type: String
  },
  fname: {
    type: String
  },
  lname: {
    type: String
  },
  gender: {
    type: String
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
    // lowercase: true,
    // validate: (value) => {
    //   return validator.isEmail(value)
    // }
  },
  referer : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: undefined
  },
  avatarUrl: {
    type: String
  },
  birthyear: {
    type: Number
  },
  origin: {
    type: String
  },
  location: {
    type: String
  },
  postcode: {
    type: String
  },
  lat: {
    type: Number
  },
  long: {
    type: Number
  },
  membertype: {
    type: String
  },
  musictype: {
    type: [MusicGenre.schema],
    default: undefined
  },
  startyear: {
    type: Number
  },
  bio: {
    type: String
  },
  favouriteparty: {
    type: String
  },
  partyfrequency: {
    type: String
  },
  favouritefestival: {
    type: String
  },
  festivalfrequency: {
    type: String
  },
  facebookUrl: {
    type: String
  },
  soundcloudUrl: {
    type: String
  },
  websiteUrl: {
    type: String
  },
  favouriteartists : {
    type: [Artist.schema],
    default: undefined
  },
  reason: {
    type: String
  },
  psystatus: {
    type: String
  }
}, 
{
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

export default mongoose.model("Member", MemberSchema);