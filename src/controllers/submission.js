const Submission = require("../models/submission");
const Episode = require("../models/episode");
const User = require("../models/user");
exports.index = (req, res) => {
  Submission.find()
    .populate("episode", "name cover")
    .populate("user", "name")
    .exec((err, result) => {
      if (err) return res.json({ result: [] });
      else return res.json({ result });
    });
};
