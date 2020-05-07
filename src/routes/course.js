const express = require("express");
const router = express.Router();
const course = require("../controllers/course");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
const { multer } = require("../middleware/upload");
/**
 * /api/course:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
// category
router.get("/", token, course.index);
router.post(
  "/create_category",
  token,
  multer.single("file"),
  validate.create_category,
  course.create_category
);
router.get("/category/:id", token, course.find_category);
router.get(
  "/category_remove_image/:filename",
  token,
  course.remove_category_image
);
module.exports = router;
