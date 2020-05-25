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
  if (isUserLoggedIn(req, res)) {
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
  }
});

/**
 * Rout handler to CREATE a new pet for a given use
 */
apiRouter.post('/api/pet', async function (req, res) {
  if (isUserLoggedIn(req, res)) {
    try {
      // check if the user already has a pet.
      const existingPet = await db.Pet.findOne({
        where: { UserId: req.user.id },
      });
      if (existingPet !== null) {
        res.status(409).json({ existingPet });
      } else {
        // add user id to pet
        req.body.UserId = req.user.id;
        const newPet = await db.Pet.create(req.body);
        res.status(201).json(newPet);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
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

/**
 * Log the user out and redirect to root i.e. the login page.
 */
apiRouter.get('/api/logout', async function (req, res) {
  try {
    if (req.user && req.user.id) {
      await db.User.update({ online: false }, { where: { id: req.user.id } });
    }
  } catch (error) {
    console.log(error);
  } finally {
    req.logOut();
    res.redirect('/');
  }
});

/**
 * Route handler to return all the opponets for currently signed in user
 */
apiRouter.get('/api/getAllOpponents', async function (req, res) {
  if (isUserLoggedIn(req, res)) {
    console.log('Getting all opponents for a user');
    // Get users at the same level +/- 20% and then filter out offline users and the push the default opponent and return the array
    const userPet = await db.Pet.findOne({ where: { UserId: req.user.id } });
    if (userPet === null) {
      res.status(422).json({
        error: 'No pet is assigned to this user. Battle is impposible.',
      });
      return;
    }
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
  }
});

/**
 *
 * @param {*} req HttpRequest Object
 * @param {*} res HttpResponse Object
 */
function isUserLoggedIn(req, res) {
  if (!req.user) {
    // user is not signed in
    // may be should redirect to root?
    res.redirect('/');
    return false;
  } else {
    return true;
  }
}

module.exports = apiRouter;
