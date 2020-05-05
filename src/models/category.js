const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
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
  created: {
    type: Date,
    default: new Date(),
  },
});
const category = mongoose.model("category", categorySchema);
module.exports = category;
