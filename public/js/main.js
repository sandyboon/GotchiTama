const BOREDOM = "boredom";
const HUNGER = "hunger";
let lastActivity = "boredom";
const feedButton = $("#feedButton");
const playButton = $("#playButton");
const battleButton = $("#battleButton");
const healthLevel = $("#healthLevel");
const speedLevel = $("#speedLevel");
const strengthLevel = $("#strengthLevel");
const currentHealthExp = $("#currentHealthExp");
const currentSpeedExp = $("#currentSpeedExp");
const type = $("#type");
const stage = $("#stage");
const popup = document.getElementById("popup");
const petImage = document.getElementById("petImage");
let petIsHungry = false;
let petIsBored = false;
let hungerTimer;
let boredTimer;

$(document).ready(function () {
  setInterval(handleActivity, 20000);
  // Attach the event handler to the button
  feedButton.click(feedPet);
  playButton.click(playWithPet);
  battleButton.click(takeToBattle);
  feedButton.attr("disabled", true);
  playButton.attr("disabled", true);
});

const throwAtPet = (itemType) => {
  const item = document.createElement("div");
  item.classList.add("thrown");
  document.body.appendChild(item);

  const xCoord =
    petImage.getBoundingClientRect().left +
    petImage.getBoundingClientRect().width / 3;
  const yCoord =
    petImage.getBoundingClientRect().top +
    petImage.getBoundingClientRect().height / 3;

  item.setAttribute(
    "style",
    `top: ${yCoord}px; right: ${xCoord}px; background-image: url('/images/${itemType}.png')`
  );

  setTimeout(() => {
    document.body.removeChild(item);
  }, 1800);
};

function handleActivity() {
  if (lastActivity === BOREDOM) {
    // this is time to be hungry
    handleHunger();
  } else {
    handleBoredom();
  }
}

const removeFromPopup = (element) => {
  popup.removeChild(element);
  if (popup.childElementCount === 0)
    popup.setAttribute("style", "display: none;");
};

const messageTimerIntoPopup = (message, state, timer) => {
  popup.setAttribute("style", "display: inherit;");
  const newDiv = document.createElement("div");
  newDiv.classList.add("popup-message");
  newDiv.innerHTML = `<p style='float: left; margin-bottom: 0'>${message}</p>`;
  const timerSpan = document.createElement("span");
  timerSpan.setAttribute("style", "float: right");
  newDiv.appendChild(timerSpan);
  popup.appendChild(newDiv);
  timer = Math.floor(timer / 1000) - 2;
  timerSpan.innerText = timer;

  if (state === "hunger") {
    const countdown = setInterval(() => {
      if (petIsHungry === true && timer > 0) {
        timer -= 1;
        timerSpan.innerText = timer;
      } else {
        removeFromPopup(newDiv);
        clearInterval(countdown);
      }
    }, 1000);
  } else {
    const countdown = setInterval(() => {
      if (petIsBored === true && timer >= 0) {
        timerSpan.innerText = timer;
        timer -= 1;
      } else {
        removeFromPopup(newDiv);
        clearInterval(countdown);
      }
    }, 1000);
  }
};

const messageIntoPopup = (message) => {
  popup.setAttribute("style", "display: inherit;");
  const newDiv = document.createElement("div");
  newDiv.classList.add("popup-message");
  newDiv.innerHTML = `<p style="margin-bottom: 0">${message}</p>`;
  popup.appendChild(newDiv);
  setTimeout(() => {
    removeFromPopup(newDiv);
  }, 5000);
};

function handleHunger() {
  lastActivity = HUNGER;
  petIsHungry = true;
  const hungerCountdown = 15000;
  // make UI notification
  messageTimerIntoPopup("Your pet is hungry!", "hunger", hungerCountdown);
  // change image
  makePetSad();
  // start the feeding timer
  hungerTimer = setTimeout(reduceHealthPoints, hungerCountdown); // timer for feeding -- 10 seconds
  // Change the appearance of the 'feed' button
  // feedButton.disabled = false;
  feedButton.removeAttr("disabled");
}

function takeToBattle() {
  window.location = "/selectOpponent";
}

function makePetSad() {
  const newSrc = `/images/pets/colour${type
    .text()
    .trim()}-stage${stage.text().trim()}-sad.png`;
  $("#petImage").attr("src", newSrc);
}

function makePetHappy() {
  const newSrc = `/images/pets/colour${type
    .text()
    .trim()}-stage${stage.text().trim()}-happy.png`;
  $("#petImage").attr("src", newSrc);
}

function reduceHealthPoints() {
  // reduce health experience points
  const petCurrentHealthExp = parseInt(currentHealthExp.text());
  messageIntoPopup(`Your pet got too hungry. It lost some health EXP!`);
  if (petIsHungry && petCurrentHealthExp >= 10) {
    let {
      petCurrentHealthExp,
      petCurrentHealthLevel,
      petCurrentStage,
    } = getPetHealthStatsFromUI();
    petCurrentHealthExp = petCurrentHealthExp - 10;
    currentHealthExp.text(petCurrentHealthExp);
    petIsHungry = false;
    // feedButton.disabled = true;
    feedButton.attr("disabled", true);
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
  throwAtPet("burger");
  console.log(petIsHungry);
  // Increase the pet Health EXP by a random amount (10-15)
  let {
    petCurrentHealthExp,
    petCurrentHealthLevel,
    petCurrentStage,
  } = getPetHealthStatsFromUI();

  petCurrentHealthExp += 45;
  currentHealthExp.text(petCurrentHealthExp);
  messageIntoPopup("Your feed your pet; it gains some health EXP!");
  makePetHappy();
  // update the level if required.
  if (moveToNexLevel("health", healthLevel.text(), currentHealthExp.text())) {
    // updat the UI
    healthLevel.text(++petCurrentHealthLevel);
    messageIntoPopup("Your pet increased one health level!");
  }

  // Visually disable the feed button and remove the event listener?
  // feedButton.disabled = true;
  feedButton.attr("disabled", true);
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
    console.log("health updated, moving to next stage...");
    if (movingToNextStage) {
      window.location = "/viewPet";
    }
  });
}

function playWithPet() {
  petIsBored = false;
  throwAtPet("ball");
  // Increase the pet Health EXP by a random amount (10-15)
  let {
    petCurrentSpeedExp,
    petCurrentSpeedLevel,
    petCurrentStage,
  } = getPetSpeedStatsFromUI();

  petCurrentSpeedExp += 40;
  messageIntoPopup("You play with your pet; it gains some speed EXP!");
  currentSpeedExp.text(petCurrentSpeedExp);
  makePetHappy();
  // update the level if required.
  if (moveToNexLevel("speed", speedLevel.text(), currentSpeedExp.text())) {
    // update the UI
    speedLevel.text(++petCurrentSpeedLevel);
    messageIntoPopup("Your pet increased one speed level!");
  }

  // Visually disable the feed button and remove the event listener?
  // playButton.disabled = true;
  playButton.attr("disabled", true);
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
    console.log("Speed updated, moving to next stage...");
    if (movingToNextStage) {
      window.location = "/viewPet";
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
    url: "/api/pet",
    type: "PUT",
    success: function (response) {
      console.log("api call succesful");
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
    url: "/api/pet",
    type: "PUT",
    success: function (response) {
      console.log("api call succesful");
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
  const boredomCountdown = 10000;
  // make UI notification
  // alert("Your Pet is Bored");
  makePetSad();
  // start the feeding timer
  messageTimerIntoPopup("Your pet is bored!", "boredom", boredomCountdown);
  boredTimer = setTimeout(reduceSpeedPoints, boredomCountdown); // timer for feeding -- 5 seconds
  // Change the appearance of the 'feed' button
  playButton.removeAttr("disabled");
  // playButton.disabled = false;
}

function reduceSpeedPoints() {
  // reduce health experience points
  const petCurrentSpeedExp = parseInt(currentSpeedExp.text());
  messageIntoPopup(`Your pet got too bored. It lost some speed EXP!`);
  if (petIsBored && petCurrentSpeedExp >= 10) {
    let {
      petCurrentSpeedExp,
      petCurrentSpeedLevel,
      petCurrentStage,
    } = getPetSpeedStatsFromUI();
    petCurrentSpeedExp = petCurrentSpeedExp - 10;
    currentSpeedExp.text(petCurrentSpeedExp);
    petIsBored = false;
    // playButton.disabled = true;
    playButton.attr("disabled", true);
    clearTimeout(boredTimer);
    sendSpeedUpdate(petCurrentSpeedExp, petCurrentSpeedLevel, petCurrentStage);
    console.log(
      `Your Pet's Speed Exp. Points is reduced to ${petCurrentSpeedExp}`
    );
  }
}

function moveToNexLevel(levelType, currentLevel, currentExp) {
  switch (levelType) {
    case "health":
      return currentExp >= 15 * (currentLevel * 5);

    case "speed":
      return currentExp >= 15 * (currentLevel * 5);

    default:
      break;
  }
}

function canMoveToNexStage(totalLevel, currentStage) {
  return currentStage < 3 && totalLevel >= (currentStage + 1) * 3;
}
