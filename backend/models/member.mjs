import mongoose from "mongoose";

const Schema = mongoose.Schema;

let MemberSchema = new Schema({
  socialid: {
    type: Number
  },
  avatar: {
    type: Buffer
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
  referer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
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
  musictype: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaticData'
  }],
  favouriteartists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaticData'
  }],
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
  favouritefestivals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StaticData'
  }],
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
  reason: {
    type: String
  },
  psystatus: {
    type: String
  },
  karmicKudos: {
    type: Number,
    default: 10
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

export default mongoose.model("Member", MemberSchema);