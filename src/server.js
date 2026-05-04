const express = require("express");
const connectToDB = require("./config/database"); //to connect to database
const cookieParser = require("cookie-parser"); //to parse the cookies from the incoming request. This will allow us to access the cookies in our route handlers using req.cookies.
const app = express(); //instance of express application
app.use(express.json()); //to parse the incoming request body as JSON for all routes. This middleware will be executed for every incoming request and it will parse the request body as JSON and make it available in req.body. So we can access the request body in our route handlers using req.body.
app.use(cookieParser()); //to parse the cookies from the incoming request. This will allow us to access the cookies in our route handlers using req.cookies.

//Importing the route handlers for different routes
const authRouter = require("./routes/auth"); //to handle the authentication related routes like signup and login
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request"); //to handle the connection request related routes like sending connection request, accepting connection request, rejecting connection request, etc.
const userRouter = require("./routes/user");
app.use("/", authRouter); //to use the authRouter for all routes that start with /auth. This way we can keep our route handlers organized and modular by separating them into different files based on their functionality.
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
