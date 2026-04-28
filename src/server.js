const express = require("express");
const connectToDB = require("./config/database"); //to connect to database
const User = require("./models/user"); //to perform DB operations on User collection
const app = express(); //instance of express application
app.use(express.json()); //to parse the incoming request body as JSON for all routes. This middleware will be executed for every incoming request and it will parse the request body as JSON and make it available in req.body. So we can access the request body in our route handlers using req.body.
//Get User by email
app.get("/user", async (req, res) => {
  const emailId = req.query.emailId; //get the emailId from query parameters
  //you can also give emailId in the request body and then access it using req.body.emailId. But since this is a GET request, it's more common to pass parameters in the query string rather than the request body. So we will use req.query.emailId to get the emailId from the query parameters.
  try {
    //const user = await User.find({ emailId }); //find the users with the given emailId in the database
    const user = await User.findOne({ emailId }); //find the user with the given emailId in the database
    //the diff b/w find and findOne is that find will return an array of users that match the given emailId while findOne will return a single user object that matches the given emailId. Since emailId is unique for each user, we can use findOne to get the user object directly without having to access the first element of the array returned by find.
    //if findOne({}) it returns the first document that matches the query. If no document matches, it returns null. So we can check if user is null or not to determine if a user with the given emailId exists in the database or not.
    if (user) {
      res.status(200).json(user); //send the user as response here res.send() will send the response as a string but we want to send the user object as a JSON response. So we will use res.json() to send the user object as a JSON response.
    } else {
      res.status(404).send("User not found"); //if user is not found in the database
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Error fetching user");
  }
});

//Feed API - GET/feed get all users frmo DB.
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find(); //fetch all users from DB
    res.status(200).json(users); //send the users as response
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});
app.post("/signup", async (req, res) => {
  console.log("req body is ", req.body);
  //Logic of DB call and get user data
  //const { firstName, lastName, emailId, password, age, gender } = req.body;
  const user = new User(req.body);
  //we pass user data from request body to the User model and create a new user instance. This will create a new user object with the data from the request body and we can then save this user object to the database using user.save() method.
  try {
    await user.save();
    res.status(201).send("User Added successfully!!");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).send("Error saving the user" + err.message);
  }
});

app.delete("/deleteUser", async (req, res) => {
  const emailId = req.query.emailId;
  try {
    const deletedUser = await User.findOneAndDelete({ emailId }); //find the user with the given emailId and delete it from the database
    if (deletedUser) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found"); //if user is not found in the database
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
});

//delete a user by id
app.delete("/deleteUserById", async (req, res) => {
  const userId = req.query.userId;
  try {
    //syntax1: const deletedUser = await User.findOneAndDelete({ _id: userId }); //find the user with the given userId and delete it from the database
    //const deletedUser = await User.findOneAndDelete({ _id: userId }); //find the user with the given userId and delete it from the database
    //syntax2: const deletedUser = await User.findByIdAndDelete(userId); //find the user with the given userId and delete it from the database
    const deletedUser = await User.findByIdAndDelete(userId); //find the user with the given userId and delete it from the database
    if (deletedUser) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found"); //if user is not found in the database
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
});

//Update data of the user
app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params?.userId; //get the userId from the URL parameters
  const updateData = req.body; //get the data to be updated from the request body

  try {
    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "bio"];
    const isUpdateAllowed = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdateAllowed) {
      return res
        .status(400)
        .send(
          "Invalid updates! Only age, gender, photoUrl and bio can be updated.",
        );
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateData,
      {
        runValidators: true, //this option is used to run the validators defined in the schema when updating a document
        returnDocument: "after", //this option is used to return the original user object before the update is applied. If we don't use this option, it will return the updated user object after the update is applied. So we can use this option to get the original user data before the update is applied and then we can compare it with the updated user data to see what has been updated.
        //meaning in response u will see older data but in DB it gets updated with the new data that u have passed in the request body. This is just for testing purpose to see the difference b/w original data and updated data. In real world, we will usually return the updated user object after the update is applied by using { new: true } option instead of { returnDocument: "before" } option.
      },
    ); //find the user with the given userId and update it with the data from the request body. The { new: true } option is used to return the updated user object after the update is applied. If we don't use this option, it will return the original user object before the update is applied.
    if (updatedUser) {
      res.status(200).json(updatedUser); //send the updated user as response
    } else {
      res.status(404).send("User not found"); //if user is not found in the database
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user: " + err.message);
  }
});
//Logic of DB call and get user data
connectToDB()
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(7777, () => {
      console.log("Server is successfully listeing on prt 7777...");
      //port number,callback to be executed when server is up n runnning
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
//Simply first connect to Db then make server listen to requests. If there is any error in connecting to DB then we will get that error in the catch block and our server will not start listening to requests.
//If server gets up and running and ready for requests and our DB is not connected properly then we will get error when we try to make
// DB calls. So we need to make sure that our DB is connected properly before we start the server.
// and then calling it inside the app.listen() callback.
// This way we can ensure that our server is up and running only after our DB is connected properly.
