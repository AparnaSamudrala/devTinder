const expresss = require("express");
const requestRouter = expresss.Router();
const { userAuth } = require("../middlewares/auth"); //to protect the routes that require authentication using the userAuth middleware function that we will create in the middlewares/auth.js file. This middleware function will verify the JWT token sent by the client in the Authorization header of the incoming requests and if the token is valid, it will allow the request to proceed to the route handler, otherwise it will return an unauthorized error response to the client.

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user; //access the user object from the request object which was attached by the userAuth middleware
  console.log("Send connection API is called...");
  //Logic of DB call and get user data
  res.send(
    user.firstName + " " + user.lastName + " sent a connection request!!",
  );
});

module.exports = requestRouter;
