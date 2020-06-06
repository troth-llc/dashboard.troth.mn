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
  duration: {
    type: String,
    default: null,
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
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
const episode = mongoose.model("episode", episodeSchema);
module.exports = episode;
