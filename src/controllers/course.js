const Category = require("../models/category");
const Course = require("../models/course");
const { validationResult } = require("express-validator");
const { bucket } = require("../middleware/upload");
const crypto = require("crypto");
const hash = crypto
  .createHash("sha1")
  .update(Math.random().toString() + new Date().valueOf().toString())
  .digest("hex");
// category
exports.category = (req, res) => {
  Category.find().then((result) => {
    let promises = result.map((res) => {
      return Course.find({ category: res._id }).then((doc) => {
        return { ...res._doc, count: doc.length };
      });
    });
    Promise.all(promises).then((result) => {
      res.json({ result });
    });
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
      "img/" + hash + "." + req.file.originalname.split(".").pop()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const cover = `http://cdn.troth.mn/${blob.name}`;
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
  remove.delete().then(() => {
    Category.findOne({
      cover: { $regex: filename, $options: "i" },
    }).then((doc) => {
      doc.cover = null;
      doc.save(() => {
        return res.json({ status: true });
      });
    });
  });
};
exports.category_remove = (req, res) => {
  const { id: _id } = req.params;
  Category.deleteOne({ _id }, (err) => {
    if (!err) return res.json({ status: true });
    else return res.json({ status: false });
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
      const cover = `http://cdn.troth.mn/${blob.name}`;
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
  Course.find()
    .populate("category", "name")
    .exec((err, result) => {
      res.json({ result });
    });
};
exports.find = (req, res) => {
  const { id } = req.params;
  Course.findById(id).then((result) => res.json({ result }));
};
exports.course_category = (req, res) => {
  const { id } = req.params;
  Course.find({ category: id })
    .populate("category", "name")
    .exec((err, result) => {
      res.json({ result });
    });
};
exports.course_remove_image = (req, res) => {
  const { filename } = req.params;
  const remove = bucket.file("img/" + filename);
  remove.delete().then(() => {
    Course.findOne({
      cover: { $regex: filename, $options: "i" },
    }).then((doc) => {
      doc.cover = null;
      doc.save(() => {
        return res.json({ status: true });
      });
    });
  });
};
exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
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
      const cover = `http://cdn.troth.mn/${blob.name}`;
      const { name, description, category } = req.body;
      const course = new Course({ name, description, category, cover });
      course.save((err) => {
        if (err) console.log(err);
        else return res.json({ status: true });
      });
    });
    blobStream.end(req.file.buffer);
  }
};
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  const { id, name, description, category } = req.body;
  if (req.file) {
    const blob = bucket.file(
      "img/" + hash + "." + req.file.originalname.split(".").pop()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", () => {
      const cover = `http://cdn.troth.mn/${blob.name}`;
      Course.findById(id).then((course) => {
        course.name = name;
        course.description = description;
        course.cover = cover;
        course.category = category;
        course.save((err) => {
          if (err) console.log(err);
          else return res.json({ status: true });
        });
      });
    });
    blobStream.end(req.file.buffer);
  } else {
    Course.findById(id).then((course) => {
      course.name = name;
      course.description = description;
      course.category = category;
      course.save((err) => {
        if (err) console.log(err);
        else return res.json({ status: true });
      });
    });
  }
};
exports.remove = (req, res) => {
  const { id: _id } = req.params;
  Course.deleteOne({ _id }, (err) => {
    if (!err) return res.json({ status: true });
    else return res.json({ status: false });
  });
};
