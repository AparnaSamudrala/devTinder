const express = require("express");
const app = express(); //instance of express application
// app.get("/user", (req, res, next) => {
//   console.log("Handling /user route 2");
//   //res.send("User route is successfully handled");
//   next();
// });
// app.get("/user", (req, res, next) => {
//   console.log("Handling /user route 1 ");
//   //next();
//   res.send("User route 1 is successfully handled");
// });
app.use((req, res, next) => {
  console.log("This is a middleware function");
  next();
});
app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling /user route 1 ");
    //res.send("User route 1 is successfully handled");
    next();
  },
  (req, res, next) => {
    console.log("Handling /user route 2");
    res.send("User route 2 is successfully handled");
  },
);
app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
