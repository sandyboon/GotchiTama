const express = require('express');
const passport = require('../config/passport');
const db = require('../models');
const apiRouter = express.Router();

/**
 * Route handler to retrieve a pet for a given user
 */
apiRouter.get('/api/pet', async function (req, res) {
  checkIfloggedIn(req, res);
  try {
    const pet = await db.Pet.findOne({ where: { userid: req.user.id } });
    // what if pet is empty?
    if (pet === null) {
      res.sendStatus(404);
    } else {
      res.json({ data: pet });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/**
 * Route handler for signing up
 */
apiRouter.post('/api/signup', async function (req, res) {
  console.log('siginig up user..');
  try {
    await db.User.create({
      email: req.body.email,
      password: req.body.password,
    });
    res.redirect(307, '/api/login');
  } catch (error) {
    res.status(401).json(error);
  }
});

/**
 * Route handler for logging user in.
 */
apiRouter.post('/api/login', passport.authenticate('local'), function (
  req,
  res
) {
  res.json(req.user);
});

function checkIfloggedIn(req, res) {
  if (!req.user) {
    // user is not signed in
    // may be should redirect to root?
    res.status(401).json({});
  }
}

module.exports = apiRouter;
