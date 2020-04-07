const { check } = require("express-validator");
exports.login = [
  check("email").isEmail(),
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
];
