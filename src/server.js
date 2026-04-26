const express = require("express");
const app = express(); //instance of express application
//always order do matters if the error is not handled in
// the same route try catch block then in the next middleware we can handle the error and send the response to the client
app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
//if try and catch are omitted in the subsequent route handlers if error is not handled the app will crash and the server will stop working and we will not be able to send response to the client
//so to avoid that we can use try catch block in the route handler and handle the error and send response to the client
// or we can use error handling middleware to handle the error and send response but order of the middleware matters
//If error handler is defined before the route handler then it will not work because the error will not be passed to the error handler and the app will crash and the server will stop working and we will not be able to send response to the client
app.get("/getUserData", (req, res) => {
  //try {
  //Logic of DB call and get user data
  throw new Error("Dummy Error");
  res.send("User Data sent!!");
  //} catch (error) {
  // res.status(500).send("Something went wrong!");
  //}
});
//app.use for error handling used before and after both places is also fine but order do matters.
//always best to write error handling middleware at the end of all the
// route handleers so that if any error is not handled in the
// route handler then it will be handled in the error handling middleware
//  and we can send response to the client instead of crashing the app and
//  stopping the server from working
app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
//order of parametes in the route handler
//two params (req,res)
//three params (req,res,next)
//four params (err,req,res,next) this is used for error handling middleware . Here err is the first param

app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
