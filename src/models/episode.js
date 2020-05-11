const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const episodeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  free: {
    type: Boolean,
    default: false,
  },
  video: {
    type: String,
    default: null,
    required: true,
  },
  files: {
    type: Array,
    default: [],
  },
  updated: {
    type: Date,
    default: new Date(),
  },
  created: {
    type: Date,
    default: new Date(),
  },
});
const episode = mongoose.model("episode", episodeSchema);
module.exports = episode;
