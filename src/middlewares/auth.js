const adminAuth = (req, res, next) => {
  const token = "abcsadsasad";
  const authoriseUser = token === "abcsadsasad";
  if (!authoriseUser) {
    res.status(401).send("You are not authorised to access this route");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  const token = "abcsadsasad";
  const authoriseUser = token === "abcsadsasad";
  if (!authoriseUser) {
    res.status(401).send("You are not authorised to access this route");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
