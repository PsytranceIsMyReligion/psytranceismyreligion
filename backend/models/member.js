import mongoose, { STATES } from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

let MemberSchema = new Schema({
  socialid: {
    type: Number
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
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
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
    type: Array
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
  facebookurl: {
    type: String
  },
  soundcloudurl: {
    type: String
  },
  websiteurl: {
    type: String
  },
  reason: {
    type: String
  },
  psystatus: {
    type: String
  }
});

export default mongoose.model("Member", MemberSchema);
