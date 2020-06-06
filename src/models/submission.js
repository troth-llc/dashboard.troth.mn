const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  episode: { type: Schema.Types.ObjectId, ref: "episode" },
  description: { type: String, default: null },
  file: { type: String, required: true },
  status: { type: String, default: "pending" },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
});
const submission = mongoose.model("submission", submissionSchema);
module.exports = submission;
