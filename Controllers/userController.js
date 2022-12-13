const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ========================JWT========================
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
const verifyToken = async (token) => {
    if (token) {
        try {
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from token
            currUser = await User.findById(decoded.id).select("-password");
            if (currUser) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    } else {
        return false;
    }
};

const testRoute = async (req, res) => {
    res.send({
        success: true,
        message: "OK",
    });
};

// ========================all users========================
const getUsers = async (req, res) => {
    await User.find()
        .then((result) => {
            res.send({
                success: true,
                data: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.send({
                success: false,
                message: err,
            });
        });
};

// ========================add user========================
const addUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.send({
            success: false,
            message: "Please fill up all fields",
        });
    } else {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.send({
                success: false,
                message: "User exists",
            });
        } else {
            if (password.length < 8) {
                res.send({
                    success: false,
                    message: "Password must be at least 8 characters",
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    activated: false,
                });
                await User.create(newUser)
                    .then(async (result) => {
                        const token = generateJWT(newUser._id);
                        // const content = {
                        //     user: newUser,
                        //     token: token,
                        //     recipient: email,
                        // };
                        // await sendEmail("verificationEmail", content).then(
                        //     (result) => {
                        //         res.send({
                        //             success: true,
                        //             data:newUser._id,
                        //             message: "Registration successful",
                        //         });
                        //     }
                        // );
                        res.send({
                            success: true,
                            data: token,
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send({
                            success: false,
                            message: err,
                        });
                    });
            }
        }
    }
};

// ========================login userT========================
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.send({
            success: false,
            message: "Please fill up all the fields",
        });
    } else {
        const user = await User.findOne({ email });
        if (user) {
            if (!user.activated) {
                res.send({
                    success: false,
                    message: "Pleaase verify your account!",
                });
            } else {
                if (await bcrypt.compare(password, user.password)) {
                    res.send({
                        success: true,
                        message: "Login successful",
                        token: generateJWT(user._id),
                    });
                } else {
                    res.send({
                        success: false,
                        message: "Invalid pasword",
                    });
                }
            }
        } else {
            res.send({
                success: false,
                message: "Invalid user",
            });
        }
    }
};
// ========================get curr user========================
const getMe = async (req, res) => {
    if (!req.user) {
        res.send({
            success: false,
            message: "Invalid user",
        });
    } else if (req.user.id.length != 24) {
        res.send({
            success: false,
            message: "Invalid ID",
        });
    } else {
        const { _id, username, email, phoneNumber } = await User.findById(
            req.user.id
        );
        // check token
        res.send({
            success: true,
            id: _id,
            username,
            email,
            phoneNumber,
        });
    }
};
// ========================verify user========================
const verifyUser = async (req, res) => {
    currentUser = await User.findById(req.params.userId);
    currentToken = req.params.token;
    validToken = verifyToken(currentToken);
    if (!validToken) {
        res.send({
            success: false,
            message: "Invalid token",
        });
    } else {
        if (!currentUser) {
            res.send({
                success: false,
                message: "User does not exist",
            });
        } else {
            if (!currentUser.activated) {
                User.updateOne({ _id: currentUser._id }, { activated: true })
                    .then((result) => {
                        res.send({
                            success: true,
                            message: "User verified",
                        });
                    })
                    .catch((err) => {
                        res.send({
                            success: false,
                            message: err,
                        });
                    });
            } else {
                res.send({
                    success: false,
                    message: "User already verified",
                });
            }
        }
    }
};

module.exports = { getUsers, testRoute, addUser, loginUser,getMe ,verifyUser};
