const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.TRANSPORTER_AUTH_USER, 
        pass: process.env.TRANSPORTER_AUTH_PASSWORD, 
    },
});
const sendEmail = async (emailType, content) => {
    const { user, token,recipient } = content;
    const { _id, name } = user;
    // content contains the following:
    // recipient email
    // user
    // token
    emailSubject = "";
    emailContent = "";
    route = "";
    if (emailType == "verificationEmail") {
        emailSubject = "Account verification";
        linkToClick = ` ${process.env.USER_INTERFACE}/verify/${_id}/${token}`;
        emailContent = `<p>Hello ${name},</p> <p>please click on <a target ="_blank" href = "${linkToClick}">this</a> link to verify your account.<p>`;
    } else if (emailType == "forgotPassword") {
        emailSubject = "Forgot your password?";
        linkToClick = ` ${process.env.USER_INTERFACE}/resetpass/${_id}/${token}`;
        emailContent = `<p>Hello ${name},</p> <p>please click on <a target ="_blank" href = "${linkToClick}">this</a> link to reset your password.<p>`;
    }
    await transporter.sendMail({
        from: `"Hust.io" ${process.env.TRANSPORTER_AUTH_USER}`, // sender address
        to: recipient, // list of receivers
        subject: emailSubject, // Subject line
        html: emailContent, // html body
    });
};

module.exports = {sendEmail}
