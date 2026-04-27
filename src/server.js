const express = require("express");
const connectToDB = require("./config/database"); //to connect to database
const User = require("./models/user"); //to perform DB operations on User collection
const app = express(); //instance of express application
app.use(express.json()); //to parse the incoming request body as JSON for all routes. This middleware will be executed for every incoming request and it will parse the request body as JSON and make it available in req.body. So we can access the request body in our route handlers using req.body.
app.post("/signup", async (req, res) => {
  console.log("req body is ", req.body);
  //Logic of DB call and get user data
  //const { firstName, lastName, emailId, password, age, gender } = req.body;
  const user = new User(req.body);
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
