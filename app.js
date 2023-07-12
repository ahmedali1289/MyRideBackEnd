const express = require('express');
const app = express();
const port = 3000; // or any port you prefer

// Import route files
const signupRouter = require('./Auth/Signup');

// Register routes
app.use('/signup', signupRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
