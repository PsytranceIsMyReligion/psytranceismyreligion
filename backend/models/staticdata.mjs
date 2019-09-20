import mongoose from "mongoose";

const Schema = mongoose.Schema;

let StaticDataSchema = new Schema({
  name: {
    type: String
  },
  type : {
      type : String
  },
});

export default mongoose.model("StaticData", StaticDataSchema); 