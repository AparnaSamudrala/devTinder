//console.log("Starting a new Project!");
const express = require("express");
const app = express(); //instance of express application
//This will match only GET API calls to /user route
//If you use app.use first even before specifying the HTTP method, then it will match all the API calls to /user route  and always it only execute the first callback function and never execute the other callback functions for the same route
//that means if you use app.use first for /user route, then it will always execute the callback function of app.use and never execute the callback functions of app.get, app.post and app.delete for /user route
//This will match all the HTTP method API calls to /user route . Hence other http methods never get executed for /user route  so order matters in express application
// app.use("/user", (req, res) => {
//   res.send("Hello from the user route!!");
// });
app.get("/user", (req, res) => {
  res.send({ firstName: "John", lastName: "Doe" });
});

app.post("/user", (req, res) => {
  console.log("Save data to the database!!");
  res.send("Data successfully saved to the database!!");
});

app.delete("/user", (req, res) => {
  console.log("Delete data from the database!!");
  res.send("Data successfully deleted from the database!!");
});
//This will match all the HTTP method API calls to /test route
app.use("/test", (req, res) => {
  res.send("Hello from the test route!!");
});

app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
