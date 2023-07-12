const express = require('express');
const app = express();
const port = 3000; // or any port you prefer

// Import route files
// Auth Routes
const signupRouter = require('./Auth/Signup');
const loginRouter = require('./Auth/Login');
const otpRouter = require('./Auth/Otp');
// const changePasswordRouter = require('./Auth/ChangePassword');
// const forgetPasswordRouter = require('./Auth/ForgetPassword');

// Auth routes
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/otp', otpRouter);
// app.use('/change-password', changePasswordRouter);
// app.use('/forget-password', forgetPasswordRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
