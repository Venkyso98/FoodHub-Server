const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const sendMails = function () {
  let mailTransporter = nodemailer.createTransport(
    smtpTransport({
      host: "172.27.172.202",
      port:25,
      auth: {
        user: "CEL",
        pass: "Gmail#@5689",
      },
      debug:true,
      logger:true,
      tls: {rejectUnauthorized: false},
    })
  );

  let mailDetails = {
    from: "CEL@evolvingsols.com",
    to: ["chiragbhaip@cybage.com","venkteshs@cybage.com"],
    subject: "Test mail:",
    text: "Otp is",
    html: "<h1>genreateOtp</h1>",
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

sendMails();