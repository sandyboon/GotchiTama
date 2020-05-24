const express = require('express');
const passport = require('../config/passport');
const db = require('../models');
const Op = db.Sequelize.Op;
const apiRouter = express.Router();
const gamePlay = require('../gamePlay/helper');

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

apiRouter.get('/api/logout', async function (req, res) {
  await db.User.update({ online: false }, { where: { id: req.user.id } });
  req.logOut();
  res.redirect('/');
});

/**
 * Route handler to return all the opponets for currently signed in user
 */
apiRouter.get('/api/getAllOpponents', async function (req, res) {
  console.log('Getting all opponents for a user');
  // Get users at the same level +/- 20% and then filter out offline users and the push the default opponent and return the array
  const userPet = await db.Pet.findOne({ where: { UserId: req.user.id } });
  const petLevelSum = gamePlay.getSumOfPetLevels(userPet);
  const maxLevelOfOpponent = petLevelSum + petLevelSum / 5;
  const minLevelOfOpponent = petLevelSum - petLevelSum / 5;
  const allOpponents = await db.Pet.findAll({
    where: {
      totallevel: {
        [Op.between]: [minLevelOfOpponent, maxLevelOfOpponent],
      },
      UserId: {
        [Op.not]: req.user.id,
      },
    },
  });

  // add the default opponent, just in case no one is online
  allOpponents.push(gamePlay.getDefaultOpponent(userPet.dataValues));

  res.json({ allOpponents: allOpponents });
});

function checkIfloggedIn(req, res) {
  if (!req.user) {
    // user is not signed in
    // may be should redirect to root?
    res.redirect('/');
  }
}

module.exports = apiRouter;
