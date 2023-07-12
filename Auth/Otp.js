const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Configuration/db');
const key = require('../Constants/sendInBlueApiKey')
const SibApiV3Sdk = require('sendinblue-api');

const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Configure SendinBlue API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = key;

// SendinBlue API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Generate and send OTP API route
router.post('/otp', (req, res) => {
  const { email } = req.body;

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

    // Send OTP to the user's email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: 'My Ride', email: 'ahmedakhter1289@gmail.com' };
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
