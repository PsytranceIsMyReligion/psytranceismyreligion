import mongoose from "mongoose";

const Schema = mongoose.Schema;

let MusicGenreSchema = new Schema({
  name: {
    type: String
  },
});

export default mongoose.model("MusicGenre", MusicGenreSchema);