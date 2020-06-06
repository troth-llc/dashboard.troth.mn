const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
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
  category: { type: Schema.Types.ObjectId, ref: "category" },
  teacher: {
    type: String,
    default: null,
  },
  episode: [{ type: Schema.Types.ObjectId, ref: "episode" }],
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
const course = mongoose.model("course", courseSchema);
module.exports = course;
