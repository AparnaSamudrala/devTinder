const express = require("express");
const app = express(); //instance of express application
const { adminAuth, userAuth } = require("./middlewares/auth"); //importing adminAuth middleware
// Handle Auth Middleware for all GET, POST , ... requests to /admin route
app.use("/admin", adminAuth);
//app.use("/user", userAuth);//bcz we only have one route for user, we can directly use the middleware in the route handler
app.post("/user/login", (req, res) => {
  res.send("User logged in");
}); //Here no need of userAuth middleware bcz this is login route, we will authenticate the user after login
app.get("/user/data", userAuth, (req, res) => {
  res.send("User data");
}); //route handler for user data
app.get("/admin/getAllData", (req, res) => {
  res.send("All Data for admin");
}); //route handler for admin dashboard

app.get("/admin/deleteUser", (req, res) => {
  res.send("User deleted");
}); //route handler for admin dashboard

app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
