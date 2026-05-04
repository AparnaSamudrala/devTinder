const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //reference to user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
    },
  },
  { timestamps: true },
);
//Compound index to ensure that there is only one connection request between the same fromUserId and toUserId in the database. This will help us to avoid duplicate connection requests between the same users and we can also keep track of the latest status of the connection request between the two users.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
// Here we are checking if the connection is sent by the same user to himself before we save the connection in DB.
connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You cannot send a request to yourself");
  }
  // no next() needed
});
//pre function runs before saving the document to the database. So we can use this pre save hook to check if the fromUserId and toUserId are the same before saving the connection request to the database. If they are the same, we can throw an error and prevent the connection request from being saved to the database. This way we can ensure that a user cannot send a connection request to themselves at the schema level itself, which will help us to maintain the integrity of our connection request system and avoid any invalid connection requests between users.
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequestModel;
