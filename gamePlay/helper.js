module.exports = {
  getDefaultOpponent: (attackingPet) => {
    // we need to create a default opponent for the attackingPet.
    const defaultOpponent = createBotOpponent(attackingPet);
    console.log(defaultOpponent);
    const {
      changeSpeed,
      isOpponentBetter,
      changeStrength,
      changeHealth,
    } = getOpponentProps();

    let totalLeeway = attackingPet.totalLevel / 5; // 20 % leeway
    console.log(totalLeeway);
    while (totalLeeway > 0) {
      if (changeSpeed) {
        console.log('Chansging speed');
        // change speed of the default opponent
        changeOpponentSpeed(defaultOpponent, isOpponentBetter);
        totalLeeway--;
      }
      if (totalLeeway > 0 && changeStrength) {
        console.log('Chansging strength');
        // change speed of the default opponent
        changeOpponentStrength(defaultOpponent, isOpponentBetter);
        totalLeeway--;
      }
      if (totalLeeway > 0 && changeHealth) {
        console.log('Chansging health');
        // change speed of the default opponent
        changeOpponentHealth(defaultOpponent, isOpponentBetter);
        totalLeeway--;
      }
      console.log('totalLeeway ' + totalLeeway);
    }
    defaultOpponent.totalLevel =
      defaultOpponent.healthLevel +
      defaultOpponent.speedLevel +
      defaultOpponent.strengthLevel;
    return defaultOpponent;
  },

  getSumOfPetLevels: (userPet) => {
    return [
      userPet.healthLevel,
      userPet.speedLevel,
      userPet.strengthLevel,
    ].reduce((a, b) => a + b, 0);
  },
};

function createBotOpponent(attackingPet) {
  const bot = { ...attackingPet };
  bot.name = 'Training Bot';
  bot.id = -1;
  bot.UserId = -1;
  return bot;
}

function changeOpponentHealth(defaultOpponent, makeHealthier) {
  let opponentHealth = defaultOpponent.healthLevel;
  defaultOpponent.healthLevel = makeHealthier
    ? ++opponentHealth
    : --opponentHealth;
}

function changeOpponentStrength(defaultOpponent, makeStronger) {
  let opponentStrength = defaultOpponent.strengthLevel;
  defaultOpponent.strengthLevel = makeStronger
    ? ++opponentStrength
    : --opponentStrength;

  console.log('defaultOpponent: ' + defaultOpponent.strengthLevel);
}

function getOpponentProps() {
  const isOpponentBetter = Math.random() >= 0.5;
  const changeSpeed = Math.random() >= 0.8;
  const changeStrength = Math.random() >= 0.5;
  // if changeSpeed is false AND changeStrength is also false then we MUST changeHealth of the default opponent.
  const changeHealth =
    Math.random() >= 0.3 || (!changeSpeed && !changeStrength);
  console.log(
    'isopponentstronger: ' +
      isOpponentBetter +
      'changeSpeed: ' +
      changeSpeed +
      'changeStrength: ' +
      changeStrength +
      'changeHealth: ' +
      changeHealth
  );
  return { changeSpeed, isOpponentBetter, changeStrength, changeHealth };
}

function changeOpponentSpeed(defaultOpponent, makeFaster) {
  let opponentSpeed = defaultOpponent.speedLevel;
  defaultOpponent.speedLevel = makeFaster ? ++opponentSpeed : --opponentSpeed;
}
