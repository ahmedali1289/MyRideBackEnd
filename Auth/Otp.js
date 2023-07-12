const sendInBlueApiKey = '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'
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Configuration/db');
const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Configure SendinBlue API client
apiKey.apiKey = sendInBlueApiKey;
// Generate and send OTP API route
router.post('/', async (req, res) => {
  const { email } = req.query;
  // Generate random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  // Save or update OTP in the database
  const query = 'INSERT INTO otps (email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = ?';
  connection.query(query, [email, otp, otp], (err, results) => {
    if (err) {
      console.error('Error saving or updating OTP:', err);
      res.status(500).json({ error: 'Failed to save or update OTP' });
      return;
    }

    console.log('hello strating',email,otp,"hello email");
    // Send OTP to the user's email
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'My Ride', email: 'noahconner1512@gmail.com' };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = 'OTP Verification';
    sendSmtpEmail.htmlContent = `Your OTP is: ${otp}`;

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log('OTP email sent successfully. Response:', data);
        res.status(200).json({ message: 'OTP sent successfully to your email' });
      },
      function (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ error: 'Failed to send OTP email' });
      }
    );
  });
});

module.exports = router;
