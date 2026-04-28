const mongoose = require("mongoose");
const validator = require("validator"); //to validate the emailId field in the user schema. This is a popular library for validating and sanitizing strings in JavaScript. We can use it to validate the emailId field to ensure that it is a valid email address before saving it to the database.
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      trim: true,
      uppercase: true, // Built-in: converts to uppercase
    }, //trim is used to remove the extra spaces from the beginning and end of the string. This will help us to avoid the issues of duplicate users with same emailId but with extra spaces in the emailId.
    lastName: {
      type: String,
      minlength: 4,
      maxlength: 50,
      trim: true,
      uppercase: true, // Built-in: converts to uppercase
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      //validate is a custom validator function that we can use to validate the emailId field before saving it to the database. We can use the validator library to validate the emailId field and ensure that it is a valid email address. If the emailId is not valid, we can throw an error and prevent the user from being saved to the database.
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format: " + value);
        }
      },
    }, //unique: true is used to ensure that no two users can have the same emailId in the database. This will help us to identify each user uniquely by their emailId.
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    }, //in real world, we should hash the password before saving it to the database for security reasons. But for simplicity, we are just storing the plain text password in the database. This is not recommended for production applications.
    age: { type: Number, min: 18 }, // for numbers it is min and for strings its minlength
    gender: {
      type: String,
      lowercase: true, // Always store as lowercase
      enum: ["male", "female", "other"], //enum is used to specify the allowed
      //validate function only runs when you first create a document
      //for update operations it will not work
      // we need to define this in the route handler of update API
      // using findOneAndUpdate() method and passing the option runValidators: true. This way we can ensure that our custom validation logic is also applied when we update a document in the database.
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        } //custom validator to ensure that the gender field can only have one of the three values: "
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      //default profile picture for the user if they don't upload one. This is just a placeholder image and you can change it to any other image you want.
      validate(value) {
        if (!validator.isURL(value)) {
          //throw an error if the value is not a valid URL
          throw new Error("Invalid URL format for photoUrl");
        }
      },
    },
    bio: {
      type: String,
      minlength: 5,
      maxlength: 200,
      default: "Hey there! I am using DevTinder.",
    }, //default value for bio field
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length >= 1 && v.length <= 20;
        },
        message: "Skills must be between 1 and 20",
      },
    },
  }, //skills will be an array of strings, each string will represent a skill of the user. For example: ["JavaScript", "Node.js", "React"]

  { timestamps: true },
); //this will add createdAt and updatedAt fields to the user document in the database. createdAt will store the date and time when the user document was created and updatedAt will store the date and time when the user document was last updated. This can be useful for tracking when a user was created and when they last updated their profile.

module.exports = mongoose.model("User", userSchema);
//models are Capitalized and singuar not camelCased.
//models are like instances of the collection in the database. So we need to create a model for each collection in the database. And then we can use that model to perform CRUD operations on that collection.
