import mongoose from "mongoose";

const Schema = mongoose.Schema;

let VideoSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  value: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
})
export default mongoose.model("Video", VideoSchema);