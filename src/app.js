//console.log("Starting a new Project!");
const express = require("express");
const app = express(); //instance of express application
app.use("/contact", (req, res) => {
  res.send("Hello from the contact route!!");
});
app.use("/about", (req, res) => {
  res.send("Hello from the about route!!");
});
app.use("/test", (req, res) => {
  res.send("Hello from the test route!!");
});
app.use("/", (req, res) => {
  console.log("Request received!!");
  res.send("Namaste from the dashboard!");
});
app.use((req, res) => {
  res.send("Hello from the server!");
}); //request handler

app.listen(7777, () => {
  console.log("Server is successfully listeing on prt 7777...");
}); //port number,callback to be executed when server is up n runnning
