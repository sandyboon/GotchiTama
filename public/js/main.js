/* When the page loads  
    Start the timer
    
    -- hunger , boredom , hunger , boredom
    -- Last action -- hunger? Bordedom ?

    handleActivity(
        callHUnger Or CallBordeoom
    )

    callHunger - 
    - Update the UI first 
    - start a time of its own -- 
    
    when penalize - reset the timer


*/
const BOREDOM = 'boredom';
const HUNGER = 'hunger';
let lastActivity = 'boredom';
const feedButton = $('#feedButton');
const playButton = $('#playButton');
const healthLevel = $('#healthLevel');
const speedLevel = $('#speedLevel');
const strengthLevel = $('#strengthLevel');
const currentHealthExp = $('#currentHealthExp');
const currentSpeedExp = $('#currentSpeedExp');
const type = $('#type');
const stage = $('#stage');
let petIsHungry = false;
let petIsBored = false;
let hungerTimer;
let boredTimer;

$(document).ready(function () {
  setInterval(handleActivitty, 10000);
  // Attach the event handler to the button
  feedButton.click(feedPet);
  playButton.click(playWithPet);
});

function handleActivitty() {
  if (lastActivity === BOREDOM) {
    // this is time to be hungry
    handleHunger();
  } else {
    handleBoredom();
  }
}

function handleHunger() {
  lastActivity = HUNGER;
  petIsHungry = true;
  // make UI notification
  alert('Your Pet is Hungry');
  // change image
  makePetSad();
  // start the feeding timer
  hungerTimer = setTimeout(reduceHealthPoints, 5000); // timer for feeding -- 5 seconds
  // Change the appearance of the 'feed' button
  feedButton.disabled = false;
}

function makePetSad() {
  const newSrc = `/images/pets/colour${type
    .text()
    .trim()}-stage${stage.text().trim()}-sad.png`;
  $('#petImage').attr('src', newSrc);
}

function makePetHappy() {
  const newSrc = `/images/pets/colour${type
    .text()
    .trim()}-stage${stage.text().trim()}-happy.png`;
  $('#petImage').attr('src', newSrc);
}

function reduceHealthPoints() {
  // reduce health experience points
  const petCurrentHealthExp = parseInt(currentHealthExp.text());
  if (petIsHungry && petCurrentHealthExp >= 10) {
    let {
      petCurrentHealthExp,
      petCurrentHealthLevel,
      petCurrentStage,
    } = getPetHealthStatsFromUI();
    petCurrentHealthExp = petCurrentHealthExp - 10;
    currentHealthExp.text(petCurrentHealthExp);
    petIsHungry = false;
    feedButton.disabled = true;
    clearTimeout(hungerTimer);
    sendHealthUpdate(
      petCurrentHealthExp,
      petCurrentHealthLevel,
      petCurrentStage
    );
    console.log(
      `Your Pet's Health Exp. Points is reduced to ${petCurrentHealthExp}`
    );
  }
}

function feedPet() {
  petIsHungry = false;
  // Increase the pet Health EXP by a random amount (10-15)
  let {
    petCurrentHealthExp,
    petCurrentHealthLevel,
    petCurrentStage,
  } = getPetHealthStatsFromUI();

  petCurrentHealthExp += 15;
  currentHealthExp.text(petCurrentHealthExp);
  makePetHappy();
  // update the level if required.
  if (moveToNexLevel('health', healthLevel.text(), currentHealthExp.text())) {
    // updat the UI
    healthLevel.text(++petCurrentHealthLevel);
  }

  // Visually disable the feed button and remove the event listener?
  feedButton.disabled = true;
  // Stop the timer: reduceHealthPoints timer??
  clearTimeout(hungerTimer);
  // Show notification that these things have happened
  console.log(
    `Your Pet's Health Exp. Points is increased to ${petCurrentHealthExp}`
  );
  // make a call to api to update the pet object
  const movingToNextStage = canMoveToNexStage(getTotalLevel(), petCurrentStage);
  petCurrentStage = movingToNextStage ? ++petCurrentStage : petCurrentStage;
  if (movingToNextStage) {
    stage.text(petCurrentStage);
  }

  sendHealthUpdate(
    petCurrentHealthExp,
    petCurrentHealthLevel,
    petCurrentStage
  ).done(function (res) {
    console.log('health updated, moving to next stage...');
    if (movingToNextStage) {
      window.location = '/viewPet';
    }
  });
}

function playWithPet() {
  petIsBored = false;
  // Increase the pet Health EXP by a random amount (10-15)
  let {
    petCurrentSpeedExp,
    petCurrentSpeedLevel,
    petCurrentStage,
  } = getPetSpeedStatsFromUI();

  petCurrentSpeedExp += 20;
  currentSpeedExp.text(petCurrentSpeedExp);
  makePetHappy();
  // update the level if required.
  if (moveToNexLevel('speed', speedLevel.text(), currentSpeedExp.text())) {
    // updat the UI
    speedLevel.text(++petCurrentSpeedLevel);
  }

  // Visually disable the feed button and remove the event listener?
  playButton.disabled = true;
  // Stop the timer: reduceHealthPoints timer??
  clearTimeout(boredTimer);
  // Show notification that these things have happened
  console.log(
    `Your Pet's speed Exp. Points is increased to ${petCurrentSpeedExp}`
  );
  // make a call to api to update the pet object
  const movingToNextStage = canMoveToNexStage(getTotalLevel(), petCurrentStage);
  petCurrentStage = movingToNextStage ? ++petCurrentStage : petCurrentStage;
  if (movingToNextStage) {
    stage.text(petCurrentStage);
  }

  sendSpeedUpdate(
    petCurrentSpeedExp,
    petCurrentSpeedLevel,
    petCurrentStage
  ).done(function (res) {
    console.log('Speed updated, moving to next stage...');
    if (movingToNextStage) {
      window.location = '/viewPet';
    }
  });
}

function getPetHealthStatsFromUI() {
  const petCurrentHealthExp = parseInt(currentHealthExp.text());
  const petCurrentHealthLevel = parseInt(healthLevel.text());
  const petCurrentStage = parseInt(stage.text());
  return { petCurrentHealthExp, petCurrentHealthLevel, petCurrentStage };
}

function getPetSpeedStatsFromUI() {
  const petCurrentSpeedExp = parseInt(currentSpeedExp.text());
  const petCurrentSpeedLevel = parseInt(speedLevel.text());
  const petCurrentStage = parseInt(stage.text());
  return { petCurrentSpeedExp, petCurrentSpeedLevel, petCurrentStage };
}

function sendHealthUpdate(currentHealthExp, level, stage) {
  const totalLevel = getTotalLevel();
  return $.ajax({
    url: '/api/pet',
    type: 'PUT',
    success: function (response) {
      console.log('api call succesful');
    },
    data: {
      currentHealthExp: currentHealthExp,
      healthLevel: level,
      totalLevel: totalLevel,
      stage: stage,
    },
  });
}

function sendSpeedUpdate(currentSpeedExp, level, stage) {
  const totalLevel = getTotalLevel();
  return $.ajax({
    url: '/api/pet',
    type: 'PUT',
    success: function (response) {
      console.log('api call succesful');
    },
    data: {
      currentSpeedExp: currentSpeedExp,
      speedLevel: level,
      totalLevel: totalLevel,
      stage: stage,
    },
  });
}

function getTotalLevel() {
  return (
    parseInt(speedLevel.text()) +
    parseInt(healthLevel.text()) +
    parseInt(strengthLevel.text())
  );
}

function handleBoredom() {
  lastActivity = BOREDOM;
  petIsBored = true;
  // make UI notification
  alert('Your Pet is Bored');
  makePetSad();
  // start the feeding timer
  boredTimer = setTimeout(reduceSpeedPoints, 6000); // timer for feeding -- 5 seconds
  // Change the appearance of the 'feed' button
  playButton.disabled = false;
}

function reduceSpeedPoints() {
  // reduce health experience points
  const petCurrentSpeedExp = parseInt(currentSpeedExp.text());
  if (petIsBored && petCurrentSpeedExp >= 10) {
    let {
      petCurrentSpeedExp,
      petCurrentSpeedLevel,
      petCurrentStage,
    } = getPetSpeedStatsFromUI();
    petCurrentSpeedExp = petCurrentSpeedExp - 10;
    currentSpeedExp.text(petCurrentSpeedExp);
    petIsBored = false;
    playButton.disabled = true;
    clearTimeout(boredTimer);
    sendSpeedUpdate(petCurrentSpeedExp, petCurrentSpeedLevel, petCurrentStage);
    console.log(
      `Your Pet's Speed Exp. Points is reduced to ${petCurrentSpeedExp}`
    );
  }
}

function moveToNexLevel(levelType, currentLevel, currentExp) {
  switch (levelType) {
    case 'health':
      return currentExp >= 15 * (currentLevel * 5);

    case 'speed':
      return currentExp >= 15 * (currentLevel * 5);

    default:
      break;
  }
}

function canMoveToNexStage(totalLevel, currentStage) {
  return currentStage < 3 && totalLevel >= (currentStage + 1) * 3;
}
