const express = require("express");
const app = express(); //instance of express application
app.get("/getUserData", (req, res) => {
  //Logic of DB call and get user data

  res.send("User Data sent!!");
});

app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
