const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/users:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, users.get);
router.post("/find", token, users.find);
router.post("/update", validate.update, token, users.update);
router.post("/search", token, users.search);
router.post("/create", validate.update, token, users.create);
module.exports = router;
