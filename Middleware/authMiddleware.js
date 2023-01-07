const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    console.log("Verify token \n")
    const cookies = req.headers.cookie;
    const rawToken = cookies.split("=")[1];
    console.log("verify rawToken\n",rawToken)
    console.log("verify rawToken length\n", rawToken.length);
    const token = rawToken.split("; ")[0];
    console.log("verify token\n",token)
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
    console.log("Refresh token \n")
    const cookies = req.headers.cookie;
    const rawToken = cookies.split("=")[1];
    console.log("verify rawToken\n",rawToken)
    console.log("verify rawToken length\n", rawToken.length);
    const prevToken = rawToken.split("; ")[0];
    console.log("verify token\n",prevToken)
    console.log("verify token length\n", prevToken.length);
    if (!prevToken) {
        return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
        }
        // res.clearCookie(`${user.id}`);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie(String(user.id), prevToken, {
            path: "/",
            expires: new Date(0), 
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.cookie(String(user.id), token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 30), // 30 seconds
            httpOnly: true,
            sameSite: "none",
            secure: true
        });

        req.id = user.id;
        next();
    });
};

module.exports = { verifyToken, refreshToken };
