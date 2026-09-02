let express = require("express");
let userRoute = express.Router();
let { auth } = require("../middleware/authmiddleware");
let {
  Register,
  Login,
  Logout,
  me,
  viewissues,
  createissues,
  viewdetails,
  updateissues,
  deleteissues,
} = require("../controller/usercontroller");
let {
  registerValidation,
  loginValidation,
  createIssueValidation,
} = require("../middleware/validators");

userRoute.post("/register", registerValidation, Register);
userRoute.post("/login", loginValidation, Login);
userRoute.post("/logout",Logout);
userRoute.get("/me", auth, me);
userRoute.get("/issues", auth, viewissues);
userRoute.post("/issues", auth, createIssueValidation, createissues);
userRoute.get("/issues/:id", auth, viewdetails);
userRoute.put("/issues/:id", auth, updateissues);
userRoute.delete("/issues/:id", auth, deleteissues);

module.exports = { userRoute };
