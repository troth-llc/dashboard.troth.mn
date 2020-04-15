const Document = require("../models/document");
const User = require("../models/user");
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
    type: "login",
  },
});
exports.get = (req, res) => {
  Document.find().then((documents) => {
    let promise = documents.map((document) => {
      return User.findById(document.user)
        .select("name username avatar phone verification_status email")
        .exec()
        .then((res) => {
          return { document, user: res };
        });
    });
    Promise.all(promise).then((result) => {
      return res.json({ result });
    });
  });
};
exports.find = (req, res) => {
  const { id } = req.body;
  Document.findOne({ _id: id }).then((document) => {
    User.findById(document.user)
      .select("name username avatar phone verification_status email created")
      .exec()
      .then((user) => {
        return res.json({ result: { document, user } });
      });
  });
};
exports.approve = (req, res) => {
  const { id } = req.params;
  Document.findById({ _id: id }).then((document) => {
    document.status = "verified";
    document.save((err) => {
      if (err) console.log(err);
      User.findById(document.user).then((user) => {
        user.verification_status = "verified";
        user.verified = true;
        user.save((err) => {
          if (err) console.log(err);
          transporter.sendMail(
            {
              from: `Troth LLC ${process.env.MAIL}`,
              to: user.email,
              subject: "Identification documents is now validated",
              html: `<p>Dear <b>${user.name}</b> <br/> We can confirm good receipt of your necessary Identification documents and that your account is now validated</p>`,
            },
            (err, info) => {
              if (err) console.log(err);
              res.json({
                status: info.accepted.length > 0 ? true : false,
              });
            }
          );
        });
      });
    });
  });
};
exports.decline = (req, res) => {
  const { id, reason } = req.body;
  Document.findById(id).then((data) => {
    User.findById(data.user).then((user) => {
      user.verification_status = null;
      user.verified = false;
      data.remove();
      user.save((err) => {
        if (err) console.log(err);
        transporter.sendMail(
          {
            from: `Troth LLC ${process.env.MAIL}`,
            to: user.email,
            subject: "Your identification documents Declined",
            html: `<p>Dear <b>${user.name}</b> <br/> Your identification declined because:${reason}</p>`,
          },
          (err, info) => {
            if (err) console.log(err);
            res.json({
              status: info.accepted.length > 0 ? true : false,
            });
          }
        );
      });
    });
  });
};
