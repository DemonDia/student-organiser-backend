const User = require("../Models/userModel");
const Event = require("../Models/eventModel");
const Journal = require("../Models/journalModel");
const QuizAttempt = require("../Models/quizAttemptModel");
const Quiz = require("../Models/quizModel");
const Task = require("../Models/taskModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../HelperFunctions");

// ========================JWT========================
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 5 * 60,
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
                        const content = {
                            user: newUser,
                            token: token,
                            recipient: email,
                        };
                        await sendEmail("verificationEmail", content).then(
                            (result) => {
                                res.send({
                                    success: true,
                                    data: newUser._id,
                                    message: "Registration successful",
                                });
                            }
                        );
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

// ========================login user========================
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return new Error(err);
    }
    if (!existingUser) {
        return res
            .status(400)
            .json({ message: "User not found. Signup Please" });
    }
    const isPasswordCorrect = bcrypt.compareSync(
        password,
        existingUser.password
    );
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Inavlid Email / Password" });
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "35s",
    });


    res.cookie(String(existingUser._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60), // 60s
        httpOnly: true,
        sameSite: "none",
        secure: true,
        overwrite: true
    });

    return res
        .status(200)
        .json({ message: "Successfully Logged In", user: existingUser, token });
};

// ========================logout user========================
const logoutUser = async (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    // const prevToken = rawToken.split("; ")[0];
    if (!prevToken) {
        return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
        }
        // res.clearCookie(`${user.id}`);
        res.cookie(String(user.id), prevToken, {
            path: "/",
            expires: new Date(0),
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        // req.cookies[`${user.id}`] = "";
        return res.status(200).json({ message: "Logged out" });
    });
};

// ========================get curr user========================
const getMe = async (req, res) => {
    const { id: userId } = req;
    let existingUser;
    try {
        existingUser = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    } else {
        return res.status(200).json({ existingUser });
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
// ========================send forget email password========================
const sendForgetPasswordEmail = async (req, res) => {
    const userEmail = req.body.email;
    await User.findOne({ email: userEmail })
        .then(async (result) => {
            if (result) {
                token = await generateJWT(result._id);
                if (result.activated) {
                    const content = {
                        user: result,
                        token: token,
                        recipient: result.email,
                    };
                    await sendEmail("forgotPassword", content)
                        .then((result) => {
                            res.send({
                                success: true,
                                message: "Email sent",
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.send({
                                success: true,
                                message: "",
                            });
                        });
                } else {
                    res.send({
                        success: true,
                        message: "",
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.send({
                success: true,
                message: "",
            });
        });
};
// ========================resets the password========================
const changeNewPassword = async (req, res) => {
    const { newPassword, token, userId } = req.body;
    validToken = verifyToken(token);
    if (!validToken) {
        res.send({
            success: false,
            message: "Invalid token",
        });
    } else {
        currentUser = await User.findById(userId);
        if (!currentUser) {
            res.send({
                success: false,
                message: "Invalid user",
            });
        } else {
            if (newPassword.length < 8) {
                res.send({
                    success: false,
                    message: "Password must be at least 8 characters!",
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                await User.updateOne(
                    { _id: currentUser._id },
                    { password: hashedPassword }
                )
                    .then((result) => {
                        res.send({
                            success: true,
                            message: "Password reset!",
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

// ========================change name========================
const changeName = async (req, res) => {
    const { userId, name } = req.body;
    await User.findById(userId).then((result) => {
        if (!result) {
            res.send({
                success: false,
                message: "User does not exist!",
            });
        } else {
            User.updateOne({ _id: result._id }, { name })
                .then((result) => {
                    res.send({
                        success: true,
                        message: "Name updated",
                    });
                })
                .catch((err) => {
                    res.send({
                        success: false,
                        message: err,
                    });
                });
        }
    });
};

// ========================delete account========================
const deleteAccount = async (req, res) => {
    userId = req.params.userId;
    currUser = await User.findById(userId);
    if (!currUser) {
        res.send({
            success: false,
            message: "User not found",
        });
    } else {
        await Event.deleteMany({ userId });
        await Journal.deleteMany({ userId });
        await QuizAttempt.deleteMany({ userId });
        await Quiz.deleteMany({ userId });
        await Task.deleteOne({ userId });
        await User.deleteOne({ _id: userId })
            .then((deleteResult) => {
                res.send({
                    success: true,
                    message: "User deleted",
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
};

module.exports = {
    getUsers,
    addUser,
    loginUser,
    logoutUser,
    getMe,
    verifyUser,
    sendForgetPasswordEmail,
    changeNewPassword,
    changeName,
    deleteAccount,
};
