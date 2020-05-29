const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
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
var createPassword = function () {
  var passAt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var passArray = Array.from({ length: 8 });

  return passArray
    .map(function (_) {
      return passAt.charAt(Math.random() * passAt.length);
    })
    .join("");
};
exports.get = function (req, res) {
  User.find()
    .select(["name", "username", "email", "phone", "type", "created"])
    .then((user) => {
      res.json({ status: true, user });
    });
};
exports.find = function (req, res) {
  const { id } = req.body;
  User.findById(id).then((user) => {
    res.json({
      status: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        type: user.type,
        created: user.created,
        avatar: user.avatar,
        about: user.about,
        website: user.website,
        following: user.following.length,
        followers: user.followers.length,
      },
    });
  });
};
exports.update = (req, res) => {
  const {
    name,
    username,
    website,
    gender,
    about,
    email,
    type,
    id,
    phone,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  User.findById(id).then((data) => {
    User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
      username: { $nin: data.username.toLowerCase() },
      email: { $nin: data.email.toLowerCase() },
    }).then((user) => {
      if (!user) {
        data.name = name;
        data.username = username.toLowerCase();
        data.website = website;
        data.gender = gender;
        data.about = about;
        data.phone = phone;
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
      else if (user.username.toLowerCase() == username.toLowerCase())
        return res.status(200).json({
          errors: [
            {
              param: "username",
              msg: "Username is already registered",
            },
          ],
        });
    });
  });
};
exports.create = (req, res) => {
  const {
    name,
    username,
    website,
    gender,
    about,
    email,
    type,
    phone,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }

  User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  }).then((user) => {
    if (!user) {
      var password = createPassword();
      var data = new User();
      data.name = name;
      data.username = username.toLowerCase();
      data.website = website;
      data.gender = gender;
      data.about = about;
      data.phone = phone;
      data.type = type;
      data.email = email;
      data.password = password;
      data.updated = new Date();
      data.save((err) => {
        if (err) return res.json({ status: false, msg: err });
        send(
          email,
          "Welcome.",
          `<p>Hey <b>${name}</b>, <br/> Thanks for signing up. Your login information is below.</p>
        <p>username: <b>${username}</b><br/>
      password: <b>${password}</b></p>
        `
        ).then((status) => res.json({ status }));
      });
    } else if (user.email.toLowerCase() == email.toLowerCase())
      return res.status(200).json({
        errors: [{ param: "email", msg: "Email is already registered" }],
      });
    else if (user.username.toLowerCase() == username.toLowerCase())
      return res.status(200).json({
        errors: [
          {
            param: "username",
            msg: "Username is already registered",
          },
        ],
      });
  });
};
exports.search = (req, res) => {
  let search = new RegExp(req.body.search, "i");
  User.find({
    $or: [
      { name: search },
      { username: search },
      { email: search },
      { phone: search },
    ],
  })
    .select(["name", "username", "email", "phone", "type", "created"])
    .then((result) => {
      res.json({ status: true, result });
    });
};
