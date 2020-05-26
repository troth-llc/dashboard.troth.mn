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
// category
router.get("/category", token, project.category);
router.post("/category/create", token, project.create_category);
router.post("/category/update", token, project.category_update);
router.get("/category/:id", token, project.category_find);
router.get("/category/remove/:id", token, project.category_remove);
// project
router.get("/", token, project.index);
router.get("/:id", token, project.find);
router.get("/approve/:id", token, project.approve);
router.post("/reject", token, project.reject);
module.exports = router;
