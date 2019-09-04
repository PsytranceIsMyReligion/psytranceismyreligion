import mongoose from "mongoose";

const Schema = mongoose.Schema;

let VideoSchema = new Schema({
  title: {
    type: String
  },
  description : {
      type : String
  },
  value : {
      type : String
  },
  order : {
    type: Number
  }
})
export default mongoose.model("Video", VideoSchema);