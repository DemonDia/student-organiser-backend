const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        const token = req.headers.authorization.split(" ")[1];
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
    } else {
        return res.status(403).json({ message: "Authentication failed" });
    }
};

const refreshToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // const cookies = req.headers.cookie;
        // const prevToken = cookies.split("=")[1];
        const prevToken = req.headers.authorization.split(" ")[1];
        if (!prevToken) {
            return res.status(400).json({ message: "Couldn't find token" });
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res
                    .status(403)
                    .json({ message: "Authentication failed" });
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
    } else {
        return res.status(403).json({ message: "Authentication failed" });
    }
};

module.exports = { verifyToken, refreshToken };
