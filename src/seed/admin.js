const seeder = require("mongoose-seed");
require("dotenv").config();
// Connect to MongoDB via Mongoose
seeder.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, () => {
  // Load Mongoose models
  seeder.loadModels(["src/models/admin.js"]);
  // Clear specified collections
  seeder.clearModels(["admin"], () => {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});

// Data array containing seed data - documents organized by Model
var data = [
  {
    model: "admin",
    documents: [
      {
        name: "admin",
        email: "tuguldur@troth.mn",
        password: "sdaminee",
      },
      {
        name: "Munkhochir",
        email: "munkhochir@troth.mn",
        password: "Munkhochirb1",
      },
    ],
  },
];
