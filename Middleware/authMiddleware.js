const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    console.log("Verify token \n");
    const cookies = req.headers.cookie;
    console.log("cookies", cookies);
    const token = cookies.split("=")[1];
    console.log("verify token\n", token);
    console.log("verify token length\n", token.length);
    if (!token) {
        return res.status(404).json({ message: "No token found" });
    }
    jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" });
        }
        if (user) {
            req.id = user.id;
            next();
        }
    });
};
const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if (!prevToken) {
        return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
        }

        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "35s",
        });
        console.log("Regenerated Token\n", token);
        req.token = token;
        req.id = user.id;
        next();
    });
};

module.exports = { verifyToken, refreshToken };
