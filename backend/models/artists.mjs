import mongoose from "mongoose";

const Schema = mongoose.Schema;

let ArtistsSchema = new Schema({
  name: {
    type: String
  },
});

export default mongoose.model("Artist", ArtistsSchema); 