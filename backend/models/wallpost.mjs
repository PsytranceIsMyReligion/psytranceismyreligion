import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
WallPostSchema.plugin(mongoosePaginate);
export default mongoose.model("WallPost", WallPostSchema);