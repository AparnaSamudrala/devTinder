const express = require("express");
const profileRouter = express.Router(); //create a new router instance for profile related routes
const { userAuth } = require("../middlewares/auth"); //to protect the routes that require authentication using the userAuth middleware function that we will create in the middlewares/auth.js file. This middleware function will verify the JWT token sent by the client in the Authorization header of the incoming requests and if the token is valid, it will allow the request to proceed to the route handler, otherwise it will return an unauthorized error response to the client.

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; //access the user object from the request object which was attached by the userAuth middleware
    res.send(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Error fetching profile" + err.message);
  }
});

module.exports = profileRouter; //export the profileRouter to be used in the server.js file where we will import it and use it as a middleware for the routes that start with /profile. This way we can keep our route handlers organized and modular by separating them into different files based on their functionality.
