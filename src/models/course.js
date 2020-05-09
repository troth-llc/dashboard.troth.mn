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
    type: Schema.ObjectId,
    ref: "Category",
    required: true,
  },
  teacher: {
    type: String,
    default: null,
  },
  episode: [
    {
      episode: {
        type: Schema.ObjectId,
        ref: "Episode",
      },
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
