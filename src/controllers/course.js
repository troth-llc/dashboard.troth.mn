const Category = require("../models/category");
const { validationResult } = require("express-validator");
exports.index = (req, res) => {
  Category.find().then((result) => {
    return res.json({ status: true, result });
  });
};
exports.create_category = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  else {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    category.save((err) => {
      if (err) console.log(err);
      else return res.json({ status: true });
    });
  }
};
exports.find_category = (req, res) => {};
