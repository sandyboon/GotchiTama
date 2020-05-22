const express = require('express');
const path = require('path');
const htmlRouter = express.Router();

htmlRouter.get('/', function (req, res) {
  if (!req.user) {
    // user needs to sign in
    res.sendFile(path.join(__dirname, '../public/signup.html'));
  }
  // if user is alread signed in then the default page is the one that shows them their pet
  res.sendFile(path.join(__dirname, '../public/viewPet.html'));
});
