const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/constants");

const adminAuth = (req, res, next) => {
  const token = "abcsadsasad";
  const authoriseUser = token === "abcsadsasad";
  if (!authoriseUser) {
    res.status(401).send("You are not authorised to access this route");
  } else {
    next();
  }
};
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }

    const decodedMessage = jwt.verify(token, JWT_SECRET);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = { adminAuth, userAuth };

