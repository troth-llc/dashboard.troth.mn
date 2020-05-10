const express = require("express");
const router = express.Router();
const episode = require("../controllers/episode");
// middleware
const token = require("../middleware/token");
const validate = require("../middleware/validator");
const { multer } = require("../middleware/upload");

/**
 * /api/episode:
 *   post:
 *     description:
 *     responses:
 *       200:
 */
router.get("/:id", token, episode.index);
router.get("/find/:id", token, episode.find);
router.get("/remove_poster/:filename", token, episode.remove_poster);
router.post("/remove", token, episode.remove);
router.post(
  "/create",
  token,
  multer.single("file"),
  validate.create_episode,
  episode.create
);
router.post(
  "/update",
  token,
  multer.single("file"),
  validate.create_episode,
  episode.update
);
module.exports = router;
