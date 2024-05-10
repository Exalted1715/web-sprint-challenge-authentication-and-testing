const { JWT_SECRET } = require("../../secrets/index.js");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        // Step 2: Handle missing token
        return res.status(401).json({ message: "token required" });
    }

    // Step 1: Verify the token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            // Step 3: Handle invalid or expired token
            return res.status(401).json({ message: "token invalid" });
        } else {
            // If the token is valid, store the decoded token in the request object
            req.decodedToken = decodedToken;
            next();
        }
    });
};
