const mongoose = require("mongoose");
const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aparnagnt_db_user:UrVFzZ7l5AqtMWX4@namastenode.p5f1koa.mongodb.net/devTinder",
  );
};

module.exports = connectToDB;
