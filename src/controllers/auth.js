const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/admin");
const { validationResult } = require("express-validator");
exports.create = function (req, res) {
  const errors = validationResult(req);
  const { name, email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  } else {
    User.findOne({ email: email.toLowerCase() }).then((user) => {
      if (user === null) {
        User.create(
          {
            name,
            email: email.toLowerCase(),
            password,
          },
          (err) => {
            if (err) throw err;
            console.log(username + " admin registered " + new Date());
            return res.status(200).json({ status: true, username });
          }
        );
      } else if (user.email.toLowerCase() == email.toLowerCase())
        return res.status(200).json({
          errors: [{ param: "email", msg: "Email is already registered" }],
        });
    });
  }
};
exports.login = function (req, res) {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  User.findOne({ email: email.toLowerCase() }).then((user) => {
    if (!user)
      return res.status(200).json({
        errors: [{ param: "email", msg: "Staff does not exist" }],
      });
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(200).json({
          errors: [{ param: "password", msg: "Password does not match" }],
        });
      jwt.sign(
        { id: user.id },
        process.env.JWTSECRET,
        {
          expiresIn: 36000, // 10 hours
        },
        (err, token) => {
          if (err) throw err;
          res.json({ status: true, token });
          console.log("admin logged in " + email + " " + new Date());
        }
      );
    });
  });
};
exports.profile = function (req, res) {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.JWTSECRET, function (err, user) {
    if (user) {
      User.findById(user.id)
        .select("-password")
        .then((user) => {
          res.json({ user });
        });
    } else {
      res.json({ err });
    }
  });
};
