import mongoose from "mongoose";
import moment from "moment";
const Schema = mongoose.Schema;

let LoginRecordSchema = new Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    duration: {
        type: Number,
        default: 0
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

// LoginRecordSchema.statics.login = function (user) {
//     return LoginRecordSchema.save({
//         memberId: user._id
//     });
// }
LoginRecordSchema.statics.logoff = function (loginRecord) {
    if (loginRecord) {
        let duration = new Date().getTime() - moment(loginRecord.createdAt).toDate().getTime();
        return this.findOneAndUpdate({
            _id: loginRecord._id
        }, {
            $set: {
                duration: duration / 1000,
                updatedAt: new Date()
            }
        }, {
            new: true
        });
    }
}
export default mongoose.model("LoginRecordSchema", LoginRecordSchema);