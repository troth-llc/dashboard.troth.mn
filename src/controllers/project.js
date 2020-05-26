const Category = require("../models/project_category");
const Project = require("../models/project");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const key = require("../../config.json");
// email config
const send = async (to, subject, html) => {
  return new Promise(async (resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.SENDER_MAIL,
        serviceClient: key.client_id,
        privateKey: key.private_key,
      },
    });
    try {
      await transporter.verify();
      var result = await transporter.sendMail({
        from: `TROTH LLC ${process.env.SENDER_MAIL}`,
        to,
        subject,
        html,
      });
      if (result.accepted.length > 0) {
        resolve(true);
      }
    } catch (err) {
      console.log(err);
      resolve(false);
    }
  });
};
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
exports.index = (req, res) => {
  Project.find()
    .populate({
      path: "owner",
      select: "name",
    })
    .populate("category", "name")
    .exec((error, result) => {
      if (error) return res.json({ status: false, msg: "INVALID_PROJECT_ID" });
      else return res.json({ result });
    });
};
exports.find = (req, res) => {
  const { id } = req.params;
  Project.findById(id)
    .populate({
      path: "owner",
      select: "name username email avatar",
    })
    .populate("category", "name")
    .exec((error, result) => {
      if (error) return res.json({ status: false, msg: "INVALID_PROJECT_ID" });
      else return res.json({ result });
    });
};
exports.approve = (req, res) => {
  const { id } = req.params;
  Project.findById(id)
    .populate({
      path: "owner",
      select: "name email",
    })
    .populate("category", "name")
    .exec((error, project) => {
      if (error) return res.json({ status: false, msg: "INVALID_PROJECT_ID" });
      project.status = true;
      project.rejected = false;
      project.save(() => res.json({ status: true }));
      send(
        project.owner.email,
        "Project.",
        `<p>Сайн байна уу <b>${project.owner.name}</b>,. <br/> Таны илгээсэн <b>${project.title}</b> нэртэй төсөл баталгаажлаа.</p>`
      );
    });
};
exports.reject = (req, res) => {
  const { id, reason } = req.body;
  Project.findById(id)
    .populate({
      path: "owner",
      select: "name email",
    })
    .populate("category", "name")
    .exec((error, result) => {
      if (error) return res.json({ status: false, msg: "INVALID_PROJECT_ID" });
      else {
        send(
          result.owner.email,
          "Project.",
          `<p>Сайн байна уу <b>${result.owner.name}</b>,. <br/> Таны илгээсэн <b>${result.title}</b> нэртэй төсөл нь: <pre>${reason}</pre> шалтгаан, шалгууруудыг хангахгүй байгаа тул энэ удаад тухайн төслийн зөвшөөрөхөөс татгалзлаа.</p>`
        );
        result.status = false;
        result.rejected = true;
        result.save(() => res.json({ status: true }));
      }
    });
};
