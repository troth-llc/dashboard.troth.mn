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
