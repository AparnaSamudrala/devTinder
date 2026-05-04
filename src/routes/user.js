const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender bio skills";
// Get all the  pending connection request for the logged in user.

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    //.populate("fromUserId", "firstName lastName"); second syntax

    res.json({
      message: `${loggedInUser.firstName} data fetched successfully!!`,
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //User should see all the user card
    //Not his own card
    // Not his connections (meaning he got it accepted)
    // Not ignored people
    // already sent the connection request
    // Example : Rahul : [Mark, Donald, MS Dhoni, Virat]
    // R -> Akshay and Akshay rejected,
    //Rahul -> Elon -> Accepted
    // Elon = [All except (Rauhl and himself)]
    //Akshay = [All except (Rahul and himself)]
    //Everyone can see new feeds which they have never seen before
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //Find all the connection requests that logged in user has sent and received
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        { toUserId: loggedInUser._id },
      ],
    })
      .select("fromUserId toUserId status")
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");
    //Set is an array that ignores duplicate items in that array
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId._id.toString());
      hideUsersFromFeed.add(req.toUserId._id.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({ length: users.length, data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
