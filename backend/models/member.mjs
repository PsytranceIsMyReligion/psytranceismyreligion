import mongoose from "mongoose";
import karmicKudoEmitter from "../utils/events";
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
    type: String
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
  },
  lastLoggedOn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

MemberSchema.statics.findMemberById = function (id) {
  return this.findById(id).populate('referer').populate('favouriteartists').populate('favouritefestivals');
};

MemberSchema.statics.getAll = function () {
  return this.find({}).populate('referer').populate('favouriteartists').populate('favouritefestivals').sort({
    'createdAt': 'desc'
  });
};

MemberSchema.statics.updateKarmicKudos = function (memberId, amount) {
  return this.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(memberId)
    }, {
      $inc: {
        karmicKudos: amount
      }
    }, {
      upsert: false,
      new: true
    },
    (err, res) => {
      if (err) {
        console.log('error updating karmic kudos')
        throw (err);
      }
      console.log('res0', res)
      if (res)
        karmicKudoEmitter.emit('karmic-kudos', res);
      return res;
    });
}

MemberSchema.statics.logon = function (user) {
  return this.findOneAndUpdate({
    _id: user._id
  }, {
    $set: {
      lastLoggedOn: new Date(),
    }
  });
}
export default mongoose.model("Member", MemberSchema);