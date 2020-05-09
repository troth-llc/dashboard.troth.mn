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
//course
router.get("/", course.index);
router.get("/course_category/:id", course.course_category);
router.post("/create", token, multer.single("file"), course.create);
// category
router.get("/category", course.category);
router.post(
  "/create_category",
  token,
  multer.single("file"),
  validate.create_category,
  course.create_category
);
router.post(
  "/edit_category",
  token,
  multer.single("file"),
  validate.create_category,
  course.edit_category
);
router.get("/find_category/:id", token, course.find_category);
router.get(
  "/category_remove_image/:filename",
  token,
  course.remove_category_image
);
module.exports = router;
