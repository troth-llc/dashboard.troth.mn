const express = require("express");
const router = express.Router();
const document = require("../controllers/document");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/document:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, document.get);
router.post("/find", token, document.find);
module.exports = router;
