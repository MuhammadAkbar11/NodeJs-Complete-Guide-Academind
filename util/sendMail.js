const nodemailer = require("nodemailer");

const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPW,
  },
});

const mailOptions = {
  fromName: "",
  to: "",
  subject: "",
};

exports.sendMailVerification = async (options = mailOptions) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, "../views/email-verification.ejs"),
    "ascii"
  );
  const rendered = ejs.render(file, { email: options.to });

  const message = {
    from: `${options.fromName} phoenix.production98@gmail.com`,
    to: options.to,
    subject: options.subject,
    text: options.message,
    html: rendered,
  };

  const info = await transporter.sendMail(message);

  return info;
};

exports.sendMailResetPassword = async (options = mailOptions) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, "../views/email-reset-password.ejs"),
    "ascii"
  );
  const rendered = ejs.render(file, { email: options.to });

  const message = {
    from: `${options.fromName} phoenix.production98@gmail.com`,
    to: options.to,
    subject: options.subject,
    text: options.message,
    html: rendered,
  };

  const info = await transporter.sendMail(message);

  return info;
};
