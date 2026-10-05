import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Look for the token in cookies OR the Authorization header
  const token = req.cookies.accessToken || req.headers['authorization']?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Pin the algorithm so a token signed with any other algorithm is rejected.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] }, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};