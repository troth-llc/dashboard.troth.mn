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
router.get("/:id", token, submission.find);
router.post("/remove", token, submission.remove);
router.get("/approve/:id", token, submission.approve);
module.exports = router;
