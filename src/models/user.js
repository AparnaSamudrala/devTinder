const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  emailId: { type: String },
  password: { type: String },
  age: { type: Number },
  gender: { type: String },
});

module.exports = mongoose.model("User", userSchema);
//models are Capitalized and singuar not camelCased.
//models are like instances of the collection in the database. So we need to create a model for each collection in the database. And then we can use that model to perform CRUD operations on that collection.
