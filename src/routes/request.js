const expresss = require("express");
const requestRouter = expresss.Router();
const { userAuth } = require("../middlewares/auth"); //to protect the routes that require authentication using the userAuth middleware function that we will create in the middlewares/auth.js file. This middleware function will verify the JWT token sent by the client in the Authorization header of the incoming requests and if the token is valid, it will allow the request to proceed to the route handler, otherwise it will return an unauthorized error response to the client.
const ConnectionRequest = require("../models/connectionRequest"); //to perform DB operations on ConnectionRequest collection
const User = require("../models/user"); //to perform DB operations on User collection

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; //we can access the logged in user details from the req.user object that we set in the userAuth middleware function after verifying the JWT token sent by the client in the Authorization header of the incoming request. This will allow us to get the details of the logged in user and use it for various purposes like authorization, personalization, etc.
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type. " + status });
      }
      // self check can also be done in schema level using pre save hook. lets do that in Schema level.
      //pre function runs before saving the document to the database. So we can use this pre save hook to check if the fromUserId and toUserId are the same before saving the connection request to the database. If they are the same, we can throw an error and prevent the connection request from being saved to the database. This way we can ensure that a user cannot send a connection request to themselves at the schema level itself, which will help us to maintain the integrity of our connection request system and avoid any invalid connection requests between users.
      //Self checks a user cannot send request to himself. This is a basic validation to ensure that a user cannot send a connection request to themselves, which would not make sense in the context of a social networking application. By checking if the fromUserId and toUserId are the same, we can prevent such invalid requests and maintain the integrity of our connection request system.
      // if (fromUserId.toString() === toUserId.toString()) {
      //   return res
      //     .status(400)
      //     .json({ message: "You cannot send a request to yourself" });
      // }
      //Checking if there is an existing connectionRequest between the same fromUserId and toUserId in the database. If there is an existing connectionRequest, then we will update the status of that connectionRequest instead of creating a new connectionRequest. This way we can avoid duplicate connectionRequests between the same users and we can also keep track of the latest status of the connection request between the two users.
      //Akshay can send request to Rohan once then Akshay cannot send the request again and Rohan too cannot send the request
      //$or is used to specify multiple conditions in the findOne() method. In our case, we want to check if there is an existing connectionRequest between the same fromUserId and toUserId in the database. So we will use $or operator to check for both conditions: fromUserId and toUserId. This way we can ensure that we are checking for the existing connectionRequest between the same users regardless of the order of fromUserId and toUserId in the database.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists!!!" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "To user not found!!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error sending connection request: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // User A => User B (Interested) => User B => User A (Accept/Reject)
      // loggedInUser means toUserId
      //status = 'interested' only we can accept or reject
      // validate the requestId that means exist in DB
      // allowed status types
      const loggedInUser = req.user._id; //we can access the logged in user details from the req.user object that we set in the userAuth middleware function after verifying the JWT token sent by the client in the Authorization header of the incoming request. This will allow us to get the details of the logged in user and use it for various purposes like authorization, personalization, etc.
      const { requestId, status } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type. " + status });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found!!!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({
        message: "Connection request " + status + " successfully!!!",
        data,
      });
    } catch (err) {
      res
        .status(400)
        .send("Error reviewing connection request: " + err.message);
    }
  },
);
module.exports = requestRouter;
