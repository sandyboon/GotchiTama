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
const lastActivity = 'boredom';
const feedButton = $('#feedButton');
const healthLevel = $('#healthLevel');
const speedLevel = $('#speedLevel');
const strengthLevel = $('#strengthLevel');
const currentHealthExp = $('#currentHealthExp');
const stage = $('#stage');
let petIsHungry = false;
let hungerTimer;

$(document).ready(function () {
  setInterval(handleActivitty, 10000);
  // Attach the event handler to the button
  feedButton.click(feedPet);
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
  petIsHungry = true;
  // make UI notification
  alert('Your Pet is Hungry');
  // start the feeding timer
  hungerTimer = setTimeout(reduceHealthPoints, 5000); // timer for feeding -- 5 seconds
  // Change the appearance of the 'feed' button
  feedButton.disabled = false;
}

function reduceHealthPoints() {
  // reduce health experience points
  const petCurrentHealthExp = parseInt(currentHealthExp.text());
  if (petIsHungry && petCurrentHealthExp >= 10) {
    let {
      petCurrentHealthExp,
      petCurrentHealthLevel,
      petCurrentStage,
    } = getPetStatsFromUI();
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
  } = getPetStatsFromUI();

  petCurrentHealthExp += 15;
  currentHealthExp.text(petCurrentHealthExp);
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

function getPetStatsFromUI() {
  const petCurrentHealthExp = parseInt(currentHealthExp.text());
  const petCurrentHealthLevel = parseInt(healthLevel.text());
  const petCurrentStage = parseInt(stage.text());
  return { petCurrentHealthExp, petCurrentHealthLevel, petCurrentStage };
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

function getTotalLevel() {
  return (
    parseInt(speedLevel.text()) +
    parseInt(healthLevel.text()) +
    parseInt(strengthLevel.text())
  );
}

function handleBoredom() {}

function moveToNexLevel(levelType, currentLevel, currentExp) {
  switch (levelType) {
    case 'health':
      return currentExp >= 15 * (currentLevel * 5);

    case 'speed':
      return currentExp >= 20 * ((currentLevel + 1) * 5);

    default:
      break;
  }
}

function canMoveToNexStage(totalLevel, currentStage) {
  return currentStage < 3 && totalLevel >= (currentStage + 1) * 3;
}
