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
// app.get("/user") matches ONLY the exact path /user
// app.use("/user") matches /user, /user/xyz, /user/1, /user/abc/def etc
//app.get("/ab?c") matches /ac and /abc but not /abbc or /abcc
//app.get("/ab+c") matches /abc, /abbc, /abbbbc but not /ac or /abcc
//app.get("/ab*c") matches /ac, /abc, /abcc, /abxyzc etc
// Pattern	Meaning	          /ac	/abc	/abbc
// /ab+c	b one or more times	✗ No	✓ Yes	✓ Yes
// /ab*c	anything between ab and c	✓ Yes	✓ Yes	✓ Yes
// Use regex to match /ac, /abc, /abbc, etc.
// /a(bc)?d/ matches /ad and /abcd but not /abccd meaning bc is optional and can occur 0 or 1 time
// /a(bc)+d matches /abcd, /abcbcd, /abcbcbcd but not /ad meaning bc is mandatory and can occur 1 or more times
// /.*fly$/ regex matches /butterfly, /dragonfly, /housefly but not /fly or /flying
app.get("/user/:id/:name/:age", (req, res) => {
  console.log(req.params); //to get the path parameters from the request
  //http://localhost:7777/user/123/Aparna/34 in postman or browser
  console.log(req.query); //to get the query parameters from the request
  //http://localhost:7777/user?name=John&age=30 in postman or browser
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
