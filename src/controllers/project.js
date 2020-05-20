const Category = require("../models/project_category");
exports.category = (req, res) => {
  Category.find().then((result) => res.json({ result }));
};
exports.create_category = (req, res) => {
  const { name } = req.body;
  if (name) {
    var category = new Category({ name });
    category.save(() => res.json({ status: true }));
  } else {
    res.json({ msg: "invalid name" });
  }
};
exports.category_find = (req, res) => {
  const { id } = req.params;
  Category.findById(id).then((result) => res.json({ result }));
};
exports.category_update = (req, res) => {
  const { id: _id, name } = req.body;
  if (name) {
    Category.findByIdAndUpdate({ _id }, { name }).then(() =>
      res.json({ status: true })
    );
  } else return res.json({ msg: "name can't be null" });
};
exports.category_remove = (req, res) => {
  const { id: _id } = req.params;
  Category.deleteOne({ _id }, () => res.json({ status: true }));
};
