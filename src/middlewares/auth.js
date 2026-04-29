const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //Read the token from  the req cookie
    const { token } = req.cookies;
    if (!token) {
      throw new Error("No token found, please login to access this resource");
    }
    const decodedObj = await jwt.verify(token, "secret-key");
    //jwt.verify() is a method provided by the jsonwebtoken library that is used to verify the authenticity of a JWT token. It takes two arguments: the token to be verified and the secret key that was used to sign the token. If the token is valid and has not been tampered with, jwt.verify() will return the decoded payload of the token as a JavaScript object. If the token is invalid or has been tampered with, jwt.verify() will throw an error.
    const { userId } = decodedObj; //decodedObj will contain the payload of the token which we set while creating the token. In our case, it will contain the userId of the logged in user.
    const user = await User.findById(userId); //find the user in the database using the userId from the token payload. This will help us to get the user details and attach it to the req object for further use in the route handlers.
    if (!user) {
      throw new Error("User not found");
    } //if user is not found in the database, we can throw an error and prevent the user from accessing the protected routes.
    req.user = user; //attach the user object to the req object so that we can access it in the route handlers. This will allow us to get the details of the logged in user and use it for various purposes like authorization, personalization, etc.
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: " + error.message);
  }
};

module.exports = { userAuth };
