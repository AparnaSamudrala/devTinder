const adminAuth = (req, res, next) => {
  console.log("Admin auth is gettong authenticated...");
  const token = "fake-token"; //in real world, you would verify the token and check if the user is authorized
  const isAdminandAuthorized = token === "fake-token"; //this is just a placeholder condition
  if (!isAdminandAuthorized) {
    res.status(401).send("Unauthorized access");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting authenticated...");
  const token = "fake-token"; //in real world, you would verify the token and check if the user is authorized
  const isUserandAuthorized = token === "fake-token"; //this is just a placeholder condition
  if (!isUserandAuthorized) {
    res.status(401).send("Unauthorized access");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
