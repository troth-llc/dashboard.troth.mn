const express = require("express");
const router = express.Router();
const project = require("../controllers/project");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
/**
 * /api/project:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/category", token, project.category);
router.post("/category/create", token, project.create_category);
router.post("/category/update", token, project.category_update);
router.get("/category/:id", token, project.category_find);
router.get("/category/remove/:id", token, project.category_remove);
module.exports = router;
