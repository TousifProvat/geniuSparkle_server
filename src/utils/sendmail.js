const nodemailer = require("nodemailer");

//transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendVerificationMail = async (email, url) => {
  const mailOptions = {
    from: `no-reply@domain.com`,
    to: email,
    subject: "Confirm user",
    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
  };

  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("mail was sent");
    }
  });
};
