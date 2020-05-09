const Category = require("../models/category");
const { validationResult } = require("express-validator");
const { bucket } = require("../middleware/upload");
const crypto = require("crypto");
const hash = crypto
  .createHash("sha1")
  .update(Math.random().toString() + new Date().valueOf().toString())
  .digest("hex");
// category
exports.category = (req, res) => {
  Category.find().then((result) => res.json({ result }));
};
exports.create_category = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  else if (!req.file)
    return res.json({ status: false, msg: "No file uploaded." });
  else {
    const blob = bucket.file(
      "img/" + hash + "." + req.file.originalname.split(".").pop()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const cover = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const { name, description } = req.body;
      const category = new Category({ name, description, cover });
      category.save((err) => {
        if (err) console.log(err);
        else return res.json({ status: true });
      });
    });
    blobStream.end(req.file.buffer);
  }
};
exports.find_category = (req, res) => {
  const { id } = req.params;
  Category.findById(id).then((result) => res.json({ result }));
};
exports.remove_category_image = (req, res) => {
  const { filename } = req.params;
  const remove = bucket.file("img/" + filename);
  remove.delete().then((data) => {
    return res.json({ status: true });
  });
};
exports.edit_category = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  const { id, name, description } = req.body;
  if (req.file) {
    const blob = bucket.file(
      "img/" + hash + "." + req.file.originalname.split(".").pop()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", () => {
      const cover = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const { name, description } = req.body;
      Category.findById(id).then((category) => {
        category.name = name;
        category.description = description;
        category.cover = cover;
        category.save((err) => {
          if (err) console.log(err);
          else return res.json({ status: true });
        });
      });
    });
    blobStream.end(req.file.buffer);
  } else {
    Category.findById(id).then((category) => {
      category.name = name;
      category.description = description;
      category.save((err) => {
        if (err) console.log(err);
        else return res.json({ status: true });
      });
    });
  }
};
// course
exports.index = (req, res) => {
  return res.json({ result: [] });
};
exports.course_category = (req, res) => {
  const { id } = req.params;
  console.log(id);
  return res.json({ result: [] });
};
