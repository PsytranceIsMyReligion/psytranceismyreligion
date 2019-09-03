import mongoose from "mongoose";

const Schema = mongoose.Schema;

let MusicGenresSchema = new Schema({
  name: {
    type: String
  },
});

export default mongoose.model("MusicGenres", MusicGenresSchema);