const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/admin:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/", token, admin.index);
router.post("/find", token, admin.find);
router.post("/create", validate.create_admin, token, admin.create);
router.post("/update", validate.create_admin, token, admin.update);
router.get("/remove/:id", token, admin.remove);
router.post("/search", token, admin.search);
router.post("/forgot", validate.email, admin.forgot);
router.post("/reset", validate.reset_password, admin.reset_password);
module.exports = router;
