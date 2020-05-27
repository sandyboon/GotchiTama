const express = require('express');
const path = require('path');
const htmlRouter = express.Router();
const db = require('../models');

htmlRouter.get('/', function (req, res) {
  console.log('request recieved');
  if (req.user) {
    // if user is alread signed in then the default page is the one that shows them their pet
    res.redirect('/viewPet');
  } else {
    console.log('user not signed in...');
    // user needs to sign in
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

htmlRouter.get('/viewPet', async function (req, res) {
  if (req.user) {
    // res.sendFile(path.join(__dirname, '../public/viewPet.html'));
    const usersPet = await db.Pet.findOne({
      raw: true,
      where: { UserId: req.user.id },
    });
    if (usersPet === null) {
      res.redirect('/selectPet');
    }
    res.render('viewPet', { pet: usersPet });
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

htmlRouter.get('/login', function (req, res) {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.redirect('/viewPet');
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

htmlRouter.get('/battle', function (req, res) {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.sendFile(path.join(__dirname, '../public/battle.html'));
  } else {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  }
});

htmlRouter.get('/signup', function (req, res) {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.redirect('/api/logout');
  } else {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
  }
});

htmlRouter.get('/selectOpponent', function (req, res) {
  if (req.user) {
    res.sendFile(path.join(__dirname, '../public/selectOpponent.html'));
  } else {
    res.redirect('/login');
  }
});

htmlRouter.get('/battleOutcome', function (req, res) {
  if (req.user) {
    res.sendFile(path.join(__dirname, '../public/battleOutcome.html'));
  } else {
    res.redirect('/login');
  }
});

htmlRouter.get('/selectPet', function (req, res) {
  if (req.user) {
    res.sendFile(path.join(__dirname, '../public/petSelection.html'));
  } else {
    res.redirect('/login');
  }
});

module.exports = htmlRouter;
