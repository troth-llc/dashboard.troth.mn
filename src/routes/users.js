const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
// middleware
const token = require("../middleware/token");
/**
 * /api/users:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, users.get);
router.post("/find", token, users.find);
module.exports = router;
