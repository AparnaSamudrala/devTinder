const express = require("express");
const profileRouter = express.Router(); //create a new router instance for profile related routes
const { userAuth } = require("../middlewares/auth"); //to protect the routes that require authentication using the userAuth middleware function that we will create in the middlewares/auth.js file. This middleware function will verify the JWT token sent by the client in the Authorization header of the incoming requests and if the token is valid, it will allow the request to proceed to the route handler, otherwise it will return an unauthorized error response to the client.
const { validateEditProfileData } = require("../utils/validation"); //to validate the data for edit profile API. This function will validate the data for edit profile API and if there is any error in the data, it will throw an error and we can catch that error in the catch block and send the error message as response to the client. If there is no error in the data, it will simply return true and we can proceed with updating the user profile in the database.

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //access the user object from the request object which was attached by the userAuth middleware
    res.send(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Error fetching profile" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit profile data");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key]; //update the user object with the new data from the request body. This will update the user object in memory but we still need to save this updated user object to the database to persist the changes.
    });

    await loggedInUser.save(); //save the updated user object to the database to persist the changes. This will update the user document in the database with the new data from the request body.
    res.json({
      message: `${loggedInUser.firstName}'s  profile updated successfully!! `,
      data: loggedInUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Error updating profile" + err.message);
  }
});
module.exports = profileRouter; //export the profileRouter to be used in the server.js file where we will import it and use it as a middleware for the routes that start with /profile. This way we can keep our route handlers organized and modular by separating them into different files based on their functionality.
