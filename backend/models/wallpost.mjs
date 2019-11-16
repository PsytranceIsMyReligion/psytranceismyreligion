import mongoose from "mongoose";

const Schema = mongoose.Schema;

let WallPostSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }],
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});
WallPostSchema.add({
    comments: [WallPostSchema]
});
export default mongoose.model("WallPost", WallPostSchema);