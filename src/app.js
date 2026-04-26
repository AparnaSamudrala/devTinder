//console.log("Starting a new Project!");
const express = require("express");
const app = express(); //instance of express application

//This will match all the HTTP method API calls to /test route and send the response "Hello from the test route!!"
//The callback function inside app.use() is called route handler and it will be executed when the route is matched
//diff ways to define multiple route handlers in express
//1. using app.use("/route", rh1,rh2,rh3,etc) where rh1,rh2,rh3 are route handlers
//2.using array of route handlers app.use("/route", [rh1,rh2,rh3,etc])
//3. app.use("/route", rh1, [rh2,rh3], rh4) where rh1 and rh4 are route handlers and rh2 and rh3 are route handlers defined in an array there is no big difference between these three ways of defining multiple route handlers in express
app.use("/user", [
  (req, res, next) => {
    //route handler function takes two parameters req and res which are request and response objects respectively

    next(); //next() is used to pass the control to the next route handler
    // if there are multiple route handlers for the same route if we don't when res.send() is not defined then the next route handler will not be executed and the response will be sent to the client immediately
    //res.send("Route handler 1");
  },
  (req, res, next) => {
    console.log("Route handler 2 is executed");
    //res.send("Route handler 2");
    next();
  },
  (req, res, next) => {
    console.log("Route handler 3 is executed");
    //res.send("Route handler 3");
    next();
  },
  (req, res, next) => {
    console.log("Route handler 4 is executed");
    //res.send("Route handler 4");
    next();
  },
  (req, res) => {
    console.log("Route handler 5 is executed");
    res.send("Route handler 5");
  },
]); //route handler 1 will be executed first and then route handler 2 will be executed

app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
