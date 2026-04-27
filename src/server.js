const express = require("express");
const connectToDB = require("./config/database"); //to connect to database
const User = require("./models/user"); //to perform DB operations on User collection
const app = express(); //instance of express application
app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Anushka",
    lastName: "Shetty",
    emailId: "Anushka@example.com",
    password: "password123",
    age: 25,
    gender: "Female",
  };
  //Creating a new instance of the User model and passing the userObj to it. This will create a new document in the User collection in the database with the data from userObj.
  const user = new User(userObj);
  await user
    .save() //This will save the document in the database and return a promise. If the document is saved successfully then we will get the saved document in the then block and if there is any error in saving the document then we will get that error in the catch block.
    .then((savedUser) => {
      console.log("User saved successfully:", savedUser);
      res.send("User signed up successfully!!");
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      res.status(500).send("Error signing up user!!");
    });
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
