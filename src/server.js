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
