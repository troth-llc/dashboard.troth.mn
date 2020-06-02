const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("☠");
});
router.use("/auth", require("./auth.js"));
router.use("/users", require("./users.js"));
router.use("/document", require("./document.js"));
router.use("/course", require("./course.js"));
router.use("/episode", require("./episode"));
router.use("/submission", require("./submission"));
router.use("/project", require("./project"));
router.use("/admin", require("./admin"));
module.exports = router;
