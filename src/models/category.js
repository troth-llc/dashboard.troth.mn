const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required,
  },
  cover: {
    type: String,
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
