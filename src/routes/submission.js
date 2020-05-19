const express = require("express");
const router = express.Router();
const submission = require("../controllers/submission");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/submission:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, submission.index);
module.exports = router;
