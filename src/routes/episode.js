const express = require("express");
const router = express.Router();
const episode = require("../controllers/episode");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
const { multer } = require("../middleware/upload");

/**
 * /api/document:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/:id", token, episode.index);
router.post(
  "/create",
  token,
  multer.single("file"),
  validate.create_episode,
  episode.create
);
module.exports = router;
