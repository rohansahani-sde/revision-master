import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Check token exists
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Extract token (Bearer TOKEN)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = verified;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default requireAuth;