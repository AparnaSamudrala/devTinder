const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format!!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditableFields = [
    "firstName",
    "lastName",
    "emailId",
    "skills",
    "age",
    "gender",
    "photoUrl",
    "bio",
  ]; //define the allowed editable fields for the user profile. This will help us to ensure that the user can only update the allowed fields and not any other fields in the user profile. This is important for security reasons and to maintain the integrity of the user data in the database.

  const isEditingAllowed = Object.keys(req.body).every((field) =>
    allowedEditableFields.includes(field),
  ); //check if all the fields in the request body are present in the allowedEditableFields array. If there is any field in the request body that is not present in the allowedEditableFields array, then we will throw an error and prevent the user from updating their profile with invalid fields.
  return isEditingAllowed; //return true if all the fields in the request body are present in the allowedEditableFields array, otherwise return false. This way we can ensure that the user can only update the allowed fields in their profile and not any other fields.
};
module.exports = { validateSignUpData, validateEditProfileData };
