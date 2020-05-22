const express = require('express');
const db = require('../models');
const apiRouter = express.Router();

/**
 * Route to retrieve a pet for a given user
 */
apiRouter.get('/pet', async function (req, res) {
  checkIfloggedIn(req, res);
  try {
    const pet = db.Pet.findOne({ where: { userid: req.user.id } });
    // what if pet is empty?
    if (pet === null) {
      res.json(404);
    }
    res.json({ data: pet });
  } catch (err) {
    res.status(500).json(err);
  }
});

// apiRouter.post('/login', passport.authenticate('local'), function (
//   req,
//   res
// ) {});

function checkIfloggedIn(req, res) {
  if (!req.user) {
    // user is not signed in
    // may be should redirect to root?
    res.status(401).json({});
  }
}

module.exports = apiRouter;
