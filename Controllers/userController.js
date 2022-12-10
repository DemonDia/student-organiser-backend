const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const testRoute = async (req, res) => {
    res.send({
        success: true,
        message: "OK",
    });
};

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
                        // const token = generateJWT(newUser._id);
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
                            data: newUser._id,
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
                    message: "Pleaase verify your account!"
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

module.exports = { getUsers, testRoute, addUser, loginUser };
