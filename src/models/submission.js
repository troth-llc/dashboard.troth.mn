const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  episode: { type: Schema.Types.ObjectId, ref: "episode" },
  description: { type: String, default: null },
  file: { type: String, required: true },
  status: { type: String, default: "pending" },
  updated: { type: Date, default: new Date() },
  created: { type: Date, default: new Date() },
});
const submission = mongoose.model("submission", submissionSchema);
module.exports = submission;
