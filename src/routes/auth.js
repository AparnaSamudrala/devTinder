const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation"); //to validate the data for signup API
const User = require("../models/user"); //to perform DB operations on User collection
const bcrypt = require("bcrypt"); //to hash the password before saving it to the database for security reasons. This is not recommended for production applications but we are using it here just for demonstration purposes.
//const jwt = require("jsonwebtoken"); //to create and verify JWT tokens for authentication and authorization purposes. We will use JWT tokens to authenticate the users and to protect the routes that require authentication. We will create a JWT token when the user logs in successfully and then we will send that token back to the client in the response. The client can then store that token in the local storage or in a cookie and send it back to the server in the Authorization header of the subsequent requests to access the protected routes. We will also create a middleware function to verify the JWT token sent by the client in the Authorization header of the incoming requests to protect the routes that require authentication.

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req); //this function will validate the data for signup API and if there is any error in the data, it will throw an error and we can catch that error in the catch block and send the error message as response to the client. If there is no error in the data, it will simply return and we can proceed with creating the user in the database.
    //Encrypt the password - in real world we should hash the password before saving it to the database for security reasons. But for simplicity, we are just storing the plain text password in the database. This is not recommended for production applications.
    const { firstName, lastName, emailId, skills, password } = req.body;
    const passwordhash = await bcrypt.hash(password, 10); //hash the password with a salt round of 10. The higher the salt round, the more secure the password will be but it will also take more time to hash the password. So we need to find a balance between security and performance when choosing the salt round. A common practice is to use a salt round of 10 or 12 for hashing passwords.
    req.body.password = passwordhash; //replace the plain text password with the hashed password in the request body before saving it to the database. This way we can ensure that the password is stored securely in the database.
    console.log("password hash is ", passwordhash);
    console.log("req body is ", req.body);
    //Logic of DB call and get user data
    //const { firstName, lastName, emailId, password, age, gender } = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordhash,
    });
    //we pass user data from request body to the User model and create a new user instance. This will create a new user object with the data from the request body and we can then save this user object to the database using user.save() method.

    await user.save();
    res.status(201).send("User Added successfully!!");
  } catch (err) {
    console.error("Error creating user: ", err);
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    //bcrypt("plain text password", "hashed password from DB") => it will return true if the plain text password matches the hashed password from the database, otherwise it will return false. So we can use this function to compare the plain text password entered by the user during login with the hashed password stored in the database for that user.
    const isMatch = await user.validatePassword(password); //this is a custom instance method that we will define in the user model to compare the plain text password with the hashed password stored in the database for that user. This method will use bcrypt.compare() function to compare the passwords and return true if they match, otherwise it will return false.
    if (isMatch) {
      //Create a JWT token
      const token = await user.getJWT(); //this will create a JWT token with the payload containing the userId of the logged in user and a secret key to sign the token. In real world, you should use a more secure secret key and store it in an environment variable instead of hardcoding it in the code. This is just for demonstration purposes.
      //console.log("Generated JWT token is ", token);
      // Add the token to cookie and send the response back to the user.
      //cookie expires in 8hours, you can change it as per your requirement. This means that the user will be logged out after 8 hours and they will need to log in again to get a new token.
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 8 * 3600000),
      }); //this will set a cookie named "token" with the value of the JWT token that we just created. The httpOnly option is set to true to prevent client-side JavaScript from accessing the cookie, which can help to mitigate certain types of cross-site scripting (XSS) attacks. This way, the cookie can only be accessed by the server and not by any malicious scripts running on the client side.
      res.status(200).send(user);
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Error during login");
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true, // must match original options
  }); //expiry is automatic set to now
  //Another way
  // res.cookie("token", null, {
  //    httpOnly: true,
  //   expires: new Date(0), // Set the expiration date to a past date
  //  });

  res.status(200).send("Logged out successfully");
});

module.exports = authRouter;
