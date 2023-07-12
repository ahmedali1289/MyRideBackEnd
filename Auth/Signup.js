const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Configuration/db');
const bcrypt = require('bcrypt');

const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Signup API route
router.post('/', (req, res) => {
  const { fName, lName, email, phone, password, role, otp } = req.query;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid Email' });
    return;
  }

  // Fetch the stored OTP for the email from the database
  const otpQuery = 'SELECT otp FROM otps WHERE email = ?';
  connection.query(otpQuery, [email], (otpErr, otpResults) => {
    if (otpErr) {
      console.error('Error retrieving OTP:', otpErr);
      res.status(500).json({ error: 'Failed to retrieve OTP' });
      return;
    }
    
    if (otpResults.length == 0 || otpResults[0].otp != otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Encrypt password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error encrypting password:', err);
        res.status(500).json({ error: 'Failed to encrypt password' });
        return;
      }

      // Insert user data into the database
      const insertQuery = `INSERT INTO users (fName, lName, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
      connection.query(insertQuery, [fName, lName, email, phone, hashedPassword, role], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error creating user:', insertErr);
          res.status(500).json({ error: 'Failed to create user' });
          return;
        }

        // Delete the OTP from the database
        const deleteQuery = 'DELETE FROM otps WHERE email = ?';
        connection.query(deleteQuery, [email], (deleteErr, deleteResults) => {
          if (deleteErr) {
            console.error('Error deleting OTP:', deleteErr);
            res.status(500).json({ error: 'Failed to delete OTP' });
            return;
          }

          res.status(201).json({ message: 'Registered successfully' });
        });
      });
    });
  });
});

module.exports = router;
