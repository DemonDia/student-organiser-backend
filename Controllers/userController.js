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
        const { _id, name, email } = await User.findById(req.user.id);
        // check token
        res.send({
            success: true,
            id: _id,
            name,
            email,
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
                    console.log("user", result);
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
        await Task.deleteOne({userId});
        await User.deleteOne({_id:userId})
            .then((deleteResult) => {
                console.log(deleteResult);
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
    getMe,
    verifyUser,
    sendForgetPasswordEmail,
    changeNewPassword,
    changeName,
    deleteAccount,
};
