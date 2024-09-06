const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, GOOGLE_APP_PASSWORD } = process.env;

const sendEmailAuthConfig = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_ADDRESS,
      pass: GOOGLE_APP_PASSWORD,
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(new Error("nodemailer failed to verify connection"));
      } else {
        resolve(success);
      }
    });
  });

  //Step 2: Setting up message options
  const messageOptions = {
    subject: subject,
    html: html,
    to: to,
    from: EMAIL_ADDRESS,
  };

  //Step 3: Sending email
  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(messageOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(new Error("nodemailer failed to send mail"));
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = sendEmailAuthConfig;
