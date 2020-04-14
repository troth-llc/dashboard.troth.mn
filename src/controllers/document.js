const Document = require("../models/document");
const User = require("../models/user");

exports.get = (req, res) => {
  Document.find().then((documents) => {
    let promise = documents.map((document) => {
      return User.findById(document.user)
        .select("name username avatar phone verification_status email")
        .exec()
        .then((res) => {
          return { document, user: res };
        });
    });
    Promise.all(promise).then((result) => {
      return res.json({ result });
    });
  });
};
exports.find = (req, res) => {
  const { id } = req.body;
  Document.findOne({ _id: id }).then((document) => {
    User.findById(document.user)
      .select("name username avatar phone verification_status email created")
      .exec()
      .then((user) => {
        return res.json({ result: { document, user } });
      });
  });
};
exports.approve = (req, res) => {
  const { id } = req.params;
  Document.findById({ _id: id }).then((document) => {
    document.status = "verified";
    document.save((err) => {
      if (err) console.log(err);
      User.findById(document.user).then((user) => {
        user.verification_status = "verified";
        user.verified = true;
        user.save((err) => {
          if (err) console.log(err);
          res.json({ status: true });
        });
      });
    });
  });
};
exports.decline = (req, res) => {
  const { id } = req.params;
  Document.findById(id).then((data) => {
    User.findById(data.user).then((user) => {
      user.verification_status = null;
      user.verified = false;
      data.remove();
      user.save((err) => {
        if (err) console.log(err);
        res.json({ status: true });
      });
    });
  });
};
