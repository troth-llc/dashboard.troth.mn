const User = require("../models/user");
exports.get = function (req, res) {
  User.find()
    .select(["name", "username", "email", "phone", "type", "created"])
    .then((user) => {
      res.json({ status: true, user });
    });
};
exports.find = function (req, res) {
  const { id } = req.body;
  console.log(id);
  User.findById(id)
    .select([
      "name",
      "username",
      "email",
      "phone",
      "type",
      "created",
      "avatar",
      "about",
    ])
    .then((user) => {
      res.json({ status: true, user });
    });
};
