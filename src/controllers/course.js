const Category = require("../models/category");
const { validationResult } = require("express-validator");
const { bucket } = require("../middleware/upload");
const crypto = require("crypto");
exports.index = (req, res) => {
  Category.find().then((result) => {
    return res.json({ status: true, result });
  });
};
exports.create_category = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  else if (!req.file)
    return res.json({ status: false, msg: "No file uploaded." });
  else {
    const blob = bucket.file(
      "img/" +
        crypto
          .createHash("sha1")
          .update(Math.random().toString() + new Date().valueOf().toString())
          .digest("hex") +
        "." +
        req.file.originalname.split(".").pop()
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
exports.find_category = (req, res) => {};
