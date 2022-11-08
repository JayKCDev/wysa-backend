const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  let token;
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1]; //Authorization: "Bearer TOKEN"
    }
    if (!token) {
      throw new Error("Authentication Failed");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError(`Authentication Failed`, 401));
  }
};
