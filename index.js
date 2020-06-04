const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT;
const mongodb = process.env.MONGO;
if (process.env.DEV == "false")
  app.use(express.static(path.join(__dirname, "/front/build")));
app.use(express.json());
app.use("/api", require("./src/routes"));
if (process.env.DEV == "false")
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname + "/front/build/index.html"))
  );
app.listen(PORT, () => {
  mongoose
    .connect(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
  mongoose.set("useCreateIndex", true);
  console.log(`server running on the port: ${PORT} - ${new Date()}`);
});
