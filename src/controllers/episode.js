const Episode = require("../models/episode");
const Course = require("../models/course");
const { validationResult } = require("express-validator");
const { bucket } = require("../middleware/upload");
const { google } = require("googleapis");
var moment = require("moment-timezone");
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

const get_youtube_duration = (id) => {
  return new Promise((resolve, reject) => {
    google.youtube("v3").videos.list(
      {
        auth: process.env.GOOGLE_APIS,
        part: "contentDetails",
        id,
      },
      (err, response) => {
        if (err) {
          reject(Error("The API returned an error: " + err));
        }
        const { items } = response.data;
        resolve(
          moment
            .duration(items[0].contentDetails.duration)
            .format("h:mm:ss")
            .padStart(4, "0:0")
        );
      }
    );
  });
};
const aget_youtube_duration = (id) => {
  google.youtube("v3").videos.list(
    {
      auth: process.env.GOOGLE_APIS,
      part: "contentDetails",
      id,
    },
    (err, response) => {
      const { items } = response.data;
      return moment
        .duration(items[0].contentDetails.duration)
        .format("h:mm:ss")
        .padStart(4, "0:0");
    }
  );
};
const isYoutube = (url) => {
  if (url.length > 10) {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : false;
  } else {
    setVideoType(false);
    disable(true);
  }
};
const isVimeo = (url) => {
  if (url.length > 10) {
    var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    var match = url.match(regExp);
    return match ? match[5] : false;
  } else {
    setVideoType(false);
    disable(true);
  }
};
const crypto = require("crypto");
const hash = () => {
  return crypto
    .createHash("sha1")
    .update(Math.random().toString() + new Date().valueOf().toString())
    .digest("hex");
};
exports.index = (req, res) => {
  const { id } = req.params;
  Course.findById(id)
    .then((result) => {
      let promises = result.episode.map((id) => {
        return Episode.findById(id).then((doc) => doc);
      });
      Promise.all(promises).then((result) =>
        res.json({ result, status: true })
      );
    })
    .catch(() => {
      return res.json({ status: false });
    });
};
exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  else if (!req.file)
    return res.json({ status: false, msg: "No file uploaded." });
  else {
    const blob = bucket.file(
      "img/" +
        hash() +
        "." +
        req.file.originalname.split(".").pop().toLowerCase()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", async () => {
      // The public URL can be used to directly access the file via HTTP.
      const cover = `http://cdn.troth.mn/${blob.name}`;
      const { name, description, link, free, id } = req.body;
      var duration = isYoutube(link)
        ? await get_youtube_duration(isYoutube(link))
        : null;
      const episode = new Episode({
        name,
        description,
        cover,
        video: link,
        free,
        duration,
      });
      episode.save().then((cat) => {
        Course.findById(id).then((course) => {
          course.episode.push(cat._id);
          course.save((err) => {
            if (err) console.log(err);
            else return res.json({ status: true });
          });
        });
      });
    });
    blobStream.end(req.file.buffer);
  }
};
exports.find = (req, res) => {
  const { id } = req.params;
  Episode.findById(id).then((result) => res.json({ result }));
};
exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(200).json({ errors: errors.array() });
  const { episode_id, name, description, link, free } = req.body;
  if (req.file) {
    const blob = bucket.file(
      "img/" +
        hash() +
        "." +
        req.file.originalname.split(".").pop().toLowerCase()
    );
    const blobStream = blob.createWriteStream();
    blobStream.on("error", (err) => {
      console.log(err);
    });
    blobStream.on("finish", () => {
      const cover = `http://cdn.troth.mn/${blob.name}`;
      Episode.findById(episode_id).then(async (episode) => {
        episode.name = name;
        episode.description = description;
        episode.cover = cover;
        episode.free = free;
        episode.link = link;
        episode.updated = new Date();
        (episode.duration = isYoutube(link)
          ? await get_youtube_duration(isYoutube(link))
          : null),
          episode.save((err) => {
            if (err) console.log(err);
            else return res.json({ status: true });
          });
      });
    });
    blobStream.end(req.file.buffer);
  } else {
    get_youtube_duration(isYoutube(link)).then((res) => {});
    Episode.findById(episode_id).then(async (episode) => {
      episode.name = name;
      episode.description = description;
      episode.free = free;
      episode.link = link;
      episode.updated = new Date();
      (episode.duration = isYoutube(link)
        ? await get_youtube_duration(isYoutube(link))
        : null),
        episode.save((err) => {
          if (err) console.log(err);
          else return res.json({ status: true });
        });
    });
  }
};
exports.remove_poster = (req, res) => {
  const { filename } = req.params;
  const remove = bucket.file("img/" + filename);
  remove.delete().then(() => {
    Episode.findOne({
      cover: { $regex: filename, $options: "i" },
    }).then((doc) => {
      console.log(doc);
      doc.cover = null;
      doc.save(() => {
        return res.json({ status: true });
      });
    });
  });
};
exports.remove = (req, res) => {
  const { episode_id, course_id } = req.body;
  Course.findById(course_id).then((course) => {
    var updated_episode = course.episode.filter(
      (arr) => arr.toString() !== episode_id.toString()
    );
    course.episode = updated_episode;
    course.save().then(() =>
      Episode.deleteOne({ episode_id }, (err) => {
        if (!err) return res.json({ status: true });
        else return res.json({ status: false });
      })
    );
  });
};
