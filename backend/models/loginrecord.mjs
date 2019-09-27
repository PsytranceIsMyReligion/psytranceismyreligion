import mongoose from "mongoose";

const Schema = mongoose.Schema;

let LoginRecordSchema = new Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    duration: {
        type: number
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false
    }
});

LoginRecordSchema.statics.login = function(user) {
    let record = new LoginRecordSchema({
        memberId : user._id,
    })
}
export default mongoose.model("Member", LoginRecordSchema);