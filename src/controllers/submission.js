const Submission = require("../models/submission");
const Episode = require("../models/episode");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const key = require("../../config.json");
// email config
const send = async (to, subject, html) => {
  return new Promise(async (resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_MAIL,
        serviceClient: key.client_id,
        privateKey: key.private_key,
      },
    });
    try {
      await transporter.verify();
      var result = await transporter.sendMail({
        from: `TROTH CAPSTONE ${process.env.SENDER_MAIL}`,
        to,
        subject,
        html,
      });
      if (result.accepted.length > 0) {
        resolve(true);
      }
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
};
exports.index = (req, res) => {
  Submission.find()
    .populate("episode", "name cover")
    .populate("user", "name")
    .exec((err, result) => {
      if (err) return res.json({ result: [] });
      else return res.json({ result });
    });
};
exports.find = (req, res) => {
  const { id } = req.params;
  Submission.findById(id)
    .populate("episode", "name cover")
    .populate("user", "name")
    .exec((err, result) => {
      if (err) return res.json({ result: [] });
      else return res.json({ result });
    });
};
exports.approve = (req, res) => {
  const { id: _id } = req.params;
  Submission.findOneAndUpdate({ _id }, { status: "approved" })
    .then(() => res.json({ status: true }))
    .catch((err) => {
      console.log(err);
      return res.json({ status: false, msg: "failed to update" });
    });
};
exports.remove = (req, res) => {
  const { id, decline } = req.body;
  Submission.findById(id)
    .populate("episode", "name")
    .populate("user", "email")
    .exec((err, submission) => {
      if (err) return res.json({ status: false });
      else {
        send(
          submission.user.email,
          `Capstone Submission`,
          `Episode: <strong>${submission.episode.name}</strong> <br/>
          ${decline}
          <hr/>
          <p>${submission.description} <br/> <a href="${submission.file}" target="_blank">Download file</a></p>
          `
        );
        submission.remove();
        return res.json({ status: true });
      }
    });
};
