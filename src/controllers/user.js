const User = require("../models/user");
const { validationResult } = require("express-validator");
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
        projects: user.projects.length,
        gender: user.gender,
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
    console.log(data.username);
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
