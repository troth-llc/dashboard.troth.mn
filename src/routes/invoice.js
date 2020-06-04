const express = require("express");
const router = express.Router();
const invoice = require("../controllers/invoice");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/invoice:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/capstone", token, invoice.capstone);
module.exports = router;
