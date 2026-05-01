const mongoose = require("mongoose");
const validator = require("validator"); //to validate the emailId field in the user schema. This is a popular library for validating and sanitizing strings in JavaScript. We can use it to validate the emailId field to ensure that it is a valid email address before saving it to the database.
const bcrypt = require("bcrypt"); //to hash the password before saving it to the database for security reasons. This is a popular library for hashing passwords in Node.js applications. We can use it to hash the password with a salt round of 10 before saving it to the database. This way we can ensure that the password is stored securely in the database and even if someone gets access to the database, they will not be able to see the plain text passwords of the users.
const jwt = require("jsonwebtoken"); //to create and verify JWT tokens for authentication and authorization purposes. We will use JWT tokens to authenticate the users and to protect the routes that require authentication. We will create a JWT token when the user logs in successfully and then we will send that token back to the client in the response. The client can then store that token in the local storage or in a cookie and send it back to the server in the Authorization header of the subsequent requests to access the protected routes. We will also create a middleware function to verify the JWT token sent by the client in the Authorization header of the incoming requests to protect the routes that require authentication.
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
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender.`,
      },
      //enum is used to specify the allowed
      //validate function only runs when you first create a document
      //for update operations it will not work
      // we need to define this in the route handler of update API
      // using findOneAndUpdate() method and passing the option runValidators: true. This way we can ensure that our custom validation logic is also applied when we update a document in the database.
      //   validate(value) {
      //     if (!["male", "female", "other"].includes(value)) {
      //       throw new Error("Invalid gender");
      //     } //custom validator to ensure that the gender field can only have one of the three values: "
      //   },
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

userSchema.methods.getJWT = async function () {
  const user = this; //this will refer to the user document that we are currently working with. So we can access the userId of the user document using this._id and include it in the payload of the JWT token that we are going to create.
  return jwt.sign({ userId: user._id }, "secret-key", {
    expiresIn: "1d",
  });
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHashInDB = user.password; //this will give us the hashed password stored in the database for that user. We can then compare this hashed password with the plain text password entered by the user during login using bcrypt.compare() function to check if they match and return true if they match, otherwise return false.

  return await bcrypt.compare(passwordInputByUser, passwordHashInDB);
};
module.exports = mongoose.model("User", userSchema);
//models are Capitalized and singuar not camelCased.
//models are like instances of the collection in the database. So we need to create a model for each collection in the database. And then we can use that model to perform CRUD operations on that collection.
