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
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  teacher: {
    type: String,
    default: null,
  },
  episode: [
    {
      type: Schema.Types.ObjectId,
      ref: "episode",
    },
  ],
  updated: {
    type: Date,
    default: new Date(),
  },
  created: {
    type: Date,
    default: new Date(),
  },
});
const course = mongoose.model("course", courseSchema);
module.exports = course;
