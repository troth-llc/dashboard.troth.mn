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
  User.findById(id).then((user) => {
    res.json({
      status: true,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        type: user.type,
        created: user.created,
        avatar: user.avatar,
        about: user.about,
        following: user.following.length,
        followers: user.followers.length,
        projects: user.projects.length,
      },
    });
  });
};
