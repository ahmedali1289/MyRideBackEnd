const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../Configuration/db');
const bcrypt = require('bcrypt');

const router = express.Router();

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Login API route
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Retrieve user data from the database
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      res.status(500).json({ error: 'Failed to retrieve user' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = results[0];
    const hashedPassword = user.password;

    // Compare entered password with the stored hashed password
    bcrypt.compare(password, hashedPassword, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ error: 'Failed to compare passwords' });
        return;
      }

      if (!passwordMatch) {
        res.status(401).json({ error: 'Incorrect password' });
        return;
      }

      // Passwords match, user is authenticated
      res.status(200).json({ message: 'Login successfully' });
    });
  });
});

module.exports = router;
