// import necessary modules
const jwt = require("jsonwebtoken");

// Middleware to check token validity
function checkTokenValidity(req, res, next) {
  const token = req.headers["cookie"]?.split("=")[1]; // Assuming token is stored in cookies
  if (!token) {
    res.redirect("/unauthorized");
    return;
  }

  // Verify token (assuming JWT)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.redirect("/login");
    }
    next();
  });
}

module.exports = checkTokenValidity;
