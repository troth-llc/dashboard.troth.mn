const Admin = require("../models/admin");
const nodemailer = require("nodemailer");
const key = require("../../config.json");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
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
        from: `TROTH LLC ${process.env.SENDER_MAIL}`,
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
const createPassword = () => {
  var passAt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var passArray = Array.from({ length: 8 });

  return passArray
    .map(function (_) {
      return passAt.charAt(Math.random() * passAt.length);
    })
    .join("");
};
exports.index = (req, res) => {
  Admin.find()
    .select("-password")
    .then((result) => res.json({ result }))
    .catch((err) =>
      res.json({ status: false, result: [], msg: "no admins found" })
    );
};
exports.find = (req, res) => {
  const { id } = req.body;
  Admin.findById(id)
    .select("-password")
    .then((result) => res.json({ result }))
    .catch((err) => req.json({ status: false, msg: "failed to find by id" }));
};
exports.create = (req, res) => {
  const { name, email, type } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  Admin.findOne({
    email: email.toLowerCase(),
  }).then((admin) => {
    if (!admin) {
      var password = createPassword();
      var data = new Admin();
      data.name = name;
      data.email = email;
      data.type = type;
      data.password = password;
      data.created = new Date();
      data.updated = new Date();
      data.save((err) => {
        if (err) return res.json({ status: false, msg: err });
        send(
          email,
          "TROTH DASHBOARD.",
          `<p>Hey <b>${name}</b>, <br/> Welcome to our team 💖. Your login information is below.</p>
         <p>email: <b>${email}</b><br/>
         password: <b>${password}</b></p><br/>
         <pre>https://dashboard.troth.mn</pre>
        `
        );
        return res.json({ status: true });
      });
    } else if (admin.email.toLowerCase() == email.toLowerCase())
      return res.status(200).json({
        errors: [{ param: "email", msg: "Email is already registered" }],
      });
  });
};
exports.update = (req, res) => {
  const { name, email, type, _id: id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  Admin.findById(id).then((data) => {
    Admin.findOne({
      $or: [{ email: email.toLowerCase() }],
      email: { $nin: data.email.toLowerCase() },
    }).then((user) => {
      if (!user) {
        data.name = name;
        data.type = type;
        data.email = email;
        data.updated = new Date();
        data.save((err) => {
          if (err) return res.json({ status: false, msg: err });
          return res.json({ status: true });
        });
      } else if (user.email.toLowerCase() == email.toLowerCase())
        return res.status(200).json({
          errors: [{ param: "email", msg: "Email is already registered" }],
        });
    });
  });
};
exports.remove = (req, res) => {
  const { id } = req.params;
  Admin.deleteOne({ _id: id }, (err) => {
    if (!err) return res.json({ status: true });
    else return res.json({ status: false });
  });
};
exports.search = (req, res) => {
  let search = new RegExp(req.body.search, "i");
  Admin.find({
    $or: [{ name: search }, { email: search }],
  })
    .select("-password")
    .then((result) => {
      res.json({ status: true, result });
    });
};
exports.forgot = function (req, res) {
  const errors = validationResult(req);
  const { email } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    Admin.findOne({ email: email.toLowerCase() }).then((user) => {
      if (!user)
        return res.status(200).json({
          errors: [{ param: "email", msg: "Admin does not exist" }],
        });
      else {
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString("hex");
          Admin.findByIdAndUpdate(
            { _id: user._id },
            {
              reset_password_token: token,
              reset_password_expires: Date.now() + 86400000,
            },
            { upsert: true, new: true }
          ).exec(async (err, new_user) => {
            if (err) console.log(err);
            send(
              new_user.email,
              "Reset your password?",
              `<p>if you requested a password reset for <b>${new_user.name}</b>, click the button below. If you didn't make this request, ignore this email.</p>
              <a href="https://dashboard.troth.mn/auth/password/${token}">Click here to reset password</>`
            ).then((result) => {
              if (!result) res.json({ status: false });
              else res.json({ status: true });
            });
          });
        });
      }
    });
  }
};
exports.reset_password = function (req, res) {
  const { password, confirm_password, token } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    Admin.findOne({
      reset_password_token: token,
      reset_password_expires: {
        $gt: Date.now(),
      },
    }).exec(function (err, user) {
      if (!err && user) {
        if (password === confirm_password) {
          user.password = password;
          user.reset_password_token = null;
          user.reset_password_expires = null;
          user.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              jwt.sign(
                { id: user._id },
                process.env.JWTSECRET,
                {
                  expiresIn: 36000, // 10 hours
                },
                (err, token) => {
                  if (err) throw err;
                  res.json({ status: true, token });
                  console.log(
                    "admin logged in " + user.name + " " + new Date()
                  );
                }
              );
            }
          });
        } else {
          return res.status(200).json({
            errors: [
              { param: "confirm_password", msg: "Passwords does not match" },
            ],
          });
        }
      } else {
        return res.status(200).json({
          errors: [
            {
              param: "token",
              msg: "Password reset token is invalid or has expired.",
            },
          ],
        });
      }
    });
  }
};
