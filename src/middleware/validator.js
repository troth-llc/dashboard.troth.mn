const { check } = require("express-validator");
const usernames = [
  "admin",
  "username",
  "profile",
  "settings",
  "search",
  "logout",
  "calendar",
  "home",
  "email",
  "password",
  "troth",
  "follow",
];
exports.login = [
  check("email").isEmail(),
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
];
exports.update = [
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("email").isEmail(),
  check("username")
    .isLength({
      min: 4,
      max: 128,
    })
    .withMessage("Must be between 4 and 128 in length")
    .not()
    .isIn(usernames)
    .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)
    .withMessage("Invalid username"),
  check("website").optional({ checkFalsy: true }).isLength({
    min: 10,
    max: 128,
  }),
  check("phone")
    .optional({ checkFalsy: true })
    .isLength({
      min: 6,
      max: 32,
    })
    .withMessage("Must be between 6 and 32 in length")
    .matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/i)
    .withMessage("Invalid phone number"),
  check("about")
    .optional({ checkFalsy: true })
    .isLength({
      min: 2,
      max: 450,
    })
    .withMessage("Must be between 2 and 450 in length"),
];
// capstone
exports.create_category = [
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("description")
    .isLength({
      min: 2,
    })
    .withMessage("Must be between 2 and 512 in length"),
];
exports.create_course = [
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("description")
    .isLength({
      min: 2,
    })
    .withMessage("Must be between 2 and 512 in length"),
];
exports.create_episode = [
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("description")
    .isLength({
      min: 2,
    })
    .withMessage("Must be between 2 and 512 in length"),
  check("link")
    .isLength({
      min: 14,
    })
    .withMessage("Must be between 14 and 128 in length"),
  check("id")
    .isLength({
      min: 8,
    })
    .withMessage("ID must included"),
];
exports.create_admin = [
  check("name")
    .isLength({
      min: 2,
      max: 72,
    })
    .withMessage("Must be between 2 and 72 in length"),
  check("email").isEmail(),
  check("weekday").not().isIn(["root", "admin"]),
];
exports.email = [check("email").isEmail()];
exports.reset_password = [
  check("password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
  check("confirm_password")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Must be between 6 and 128 in length"),
  check("token")
    .isLength({
      min: 20,
      max: 128,
    })
    .withMessage("invalid token"),
];
