const Invoice = require("../models/invoice");
exports.capstone = (req, res) => {
  Invoice.find()
    .then((result) => res.json({ result }))
    .catch((err) => {
      return res.json({ result: [], status: "err" });
    });
};
