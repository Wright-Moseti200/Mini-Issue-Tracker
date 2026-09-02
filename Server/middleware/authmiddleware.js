let jwt = require("jsonwebtoken");
require("dotenv").config();

let auth = (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication"
      });
    }
    let payload = jwt.verify(token, process.env.JWT_PAS);
    req.user = { id: payload.id };
    next();
  }
  catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message
    });
  }
}

module.exports = { auth }