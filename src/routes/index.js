const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("☠");
});
router.use("/auth", require("./auth.js"));
router.use("/users", require("./users.js"));
router.use("/document", require("./document.js"));

module.exports = router;
