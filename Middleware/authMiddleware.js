const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    console.log("Verify token \n")
    const cookies = req.headers.cookie;
    console.log("cookies",cookies)
    // console.log(req.headers)
    // const rawToken = cookies.split("=")[1];
    // console.log("verify rawToken\n",rawToken)
    // console.log("verify rawToken length\n", rawToken.length);
    // const token = rawToken.split("; ")[0];
    const token = cookies.split("=")[1];
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
    console.log("cookies",cookies)
    // console.log(req.headers)
    // const rawToken = cookies.split("=")[1];
    // console.log("verify rawToken\n",rawToken)
    // console.log("verify rawToken length\n", rawToken.length);
    // const prevToken = rawToken.split("; ")[0];

    const prevToken = cookies.split("=")[1];
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
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";
        
        const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "60s",
        });

        res.cookie(String(user.id), newToken, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60), // 60 seconds
            httpOnly: false,
            sameSite: "none",
            secure: true
        });

        req.id = user.id;
        next();
    });
};

module.exports = { verifyToken, refreshToken };
