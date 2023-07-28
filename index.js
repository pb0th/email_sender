const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();
const otp = require("./otp");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.post("/email", async (req, res) => {
  try {
    // generate the 6 digits code
    const otp_code = otp();
    // get the client email from request body
    const clientEmail = req.body.email;
    // construct the transporter object for sending email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    //   the message to be sent
    const html = `
        <h1><b>YOUR OTP</b></h1>
        <h3>
            ${otp_code}
        </h3>
      `;
    const mailOptions = {
      from: req.body.email,
      to: clientEmail,
      subject: "Enter your otp now",
      html,
    };

    //   send the email
    const response = await transporter.sendMail(mailOptions);
    return res.json("email sent successfully");
  } catch (error) {
    return res.json("something went wrong while sending the OTP");
  }
});

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
