const attacks = [
  { name: "Strike", speed: "slow", safety: "safe", impact: "weak" },
  { name: "Bodyslam", speed: "fast", safety: "safe", impact: "weak" },
  { name: "Tackle", speed: "slow", safety: "safe", impact: "strong" },
  { name: "Lunge", speed: "fast", safety: "dangerous", impact: "strong" },
];

const messageDiv = document.getElementById("message");
const attacksDiv = document.getElementById("attacks");
const otherPetImg = document.getElementById("otherPetImg");
const myPetImg = document.getElementById("myPetImg");

const message = (text) => {
  const newMessage = document.createElement("p");
  newMessage.innerHTML = text;
  messageDiv.appendChild(newMessage);
};

const getAvailableAttacks = (pet) => {
  switch (pet.stage) {
    case 1:
      return [attacks[0], attacks[1]];
    case 2:
      return [attacks[0], attacks[1], attacks[2]];
    case 3:
      return [attacks[0], attacks[1], attacks[2], attacks[3]];
  }
};

const fight = async () => {
  const foo = await fetch("/api/pet");
  const bar = await foo.json();
  const ourPet = bar.data;

  ourPet.availableAttacks = getAvailableAttacks(ourPet);
  ourPet.hitpoints = ourPet.healthLevel * 10;
  document.getElementById("our-pet-name").innerHTML = ourPet.name;
  const ourPetHitpoints = document.getElementById("our-pet-health");
  document.getElementById("our-pet-speed").innerHTML =
    "Speed: " + ourPet.speedLevel;
  document.getElementById("our-pet-strength").innerHTML =
    "Strength: " + ourPet.strengthLevel;
  myPetImg.setAttribute(
    "src",
    `../images/pets/stage${ourPet.stage}-behind.png`
  );
  ourPet.image = myPetImg;

  // const opponent = await {
  //   name: "Other_Pet",
  //   stage: 3,
  //   type: 1,
  //   healthLevel: 1,
  //   strengthLevel: 2,
  //   speedLevel: 1,
  //   strengthExp: 186,
  //   healthExp: 263,
  // };

  // Finding your opponent based on the URL parameter

  const urlParams = new URLSearchParams(window.location.search);
  const opponentId = urlParams.get("opponent");

  const rune = await fetch("api/getAllOpponents");
  const scim = await rune.json();
  const opponents = scim.allOpponents;

  const opponent = opponents.find((dds) => dds.id.toString() === opponentId);
  console.log(opponent);

  opponent.availableAttacks = getAvailableAttacks(opponent);
  opponent.hitpoints = opponent.healthLevel * 10;
  document.getElementById("other-pet-name").innerHTML = opponent.name;
  const opponentHipoints = document.getElementById("other-pet-health");
  document.getElementById("other-pet-speed").innerHTML =
    "Speed: " + opponent.speedLevel;
  document.getElementById("other-pet-strength").innerHTML =
    "Strength: " + opponent.strengthLevel;
  otherPetImg.setAttribute(
    "src",
    `../images/pets/colour${opponent.type}-stage${opponent.stage}-happy.png`
  );
  opponent.image = otherPetImg;

  const refreshHitpoints = () => {
    console.log(
      `Opponent HP: ${opponent.hitpoints}    Your HP: ${ourPet.hitpoints}`
    );
    const opponentHipointsPercentage =
      opponent.hitpoints > 0
        ? (opponent.hitpoints / opponent.healthLevel) * 10
        : 0;
    opponentHipoints.setAttribute(
      "style",
      `width: ${opponentHipointsPercentage}%;`
    );
    const ourPetHitpointsPercentage =
      ourPet.hitpoints > 0 ? (ourPet.hitpoints / ourPet.healthLevel) * 10 : 0;
    ourPetHitpoints.setAttribute(
      "style",
      `width: ${ourPetHitpointsPercentage}%;`
    );
  };

  const declareWinner = (winner) => {
    setTimeout(() => {
      messageDiv.innerHTML = null;
      attacksDiv.innerHTML = null;
      if (winner === ourPet) {
        message(`${ourPet.name} won the battle!`);
        setTimeout(() => {
          message(`${ourPet.name} gained 25 strength experience`);

          fetch("/api/pet", {
            method: "put",
            headers: {
              "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
            body: JSON.stringify({
              currentStrengthExp: ourPet.currentStrengthExp + 25,
            }),
          });
        }, 700);
        otherPetImg.setAttribute(
          "src",
          `../images/pets/colour${opponent.type}-stage${opponent.stage}-sad.png`
        );
        myPetImg.setAttribute(
          "src",
          `../images/pets/colour${ourPet.type}-stage${ourPet.stage}-happy.png`
        );
      } else {
        message(`Oh no, ${ourPet.name} lost the battle!`);
        setTimeout(() => {
          message(`${ourPet.name} lost 10 health experience`);

          const lostHealthExp =
            ourPet.currentHealthExp > 9 ? 10 : ourPet.currentHealthExp;
          fetch("/api/pet", {
            method: "put",
            headers: {
              "Content-type": "application/json; charset=UTF-8", // Indicates the content
            },
            body: JSON.stringify({
              currentHealthExp: ourPet.currentHealthExp - lostHealthExp,
            }),
          });
        }, 700);
        otherPetImg.setAttribute(
          "src",
          `../images/pets/colour${opponent.type}-stage${opponent.stage}-happy.png`
        );
        myPetImg.setAttribute(
          "src",
          `../images/pets/colour${ourPet.type}-stage${ourPet.stage}-sad.png`
        );
      }
      setTimeout(() => {
        attacksDiv.innerHTML = `<a class='button button-primary' href="/">Home</a>`;
      }, 700);
    }, 1400);
  };

  const battleTurn = (attacker, defender, attack) => {
    myPetImg.className = "";
    otherPetImg.className = "";
    // Function for ending turns
    const endTurn = (attacker, defender) => {
      if (defender.hitpoints < 1) return declareWinner(attacker);
      if (attacker.hitpoints < 1) return declareWinner(defender);

      if (attacker === opponent) {
        [...document.getElementsByClassName("attack")].forEach((button) => {
          button.classList.add("attack-active");
          button.addEventListener("click", () => {
            battleTurn(
              ourPet,
              opponent,
              attacks[button.getAttribute("data-attack")]
            );
          });
        });
      } else {
        battleTurn(
          opponent,
          ourPet,
          opponent.availableAttacks[
            Math.floor(Math.random() * opponent.availableAttacks.length)
          ]
        );
      }
    };

    const delay = 700;

    // Deactivates the attack buttons once our turn starts
    if (attacker === ourPet) {
      messageDiv.innerHTML = null;
      [...document.getElementsByClassName("attack")].forEach((button) => {
        button.classList.remove("attack-active");
      });
      document.querySelector(
        ".attack"
      ).parentElement.innerHTML = document.querySelector(
        ".attack"
      ).parentElement.innerHTML;
    }

    message(`${attacker.name} uses ${attack.name}`);

    // After delay: Check if attacker hurt itself while attempting to attack
    setTimeout(() => {
      if (attack.safety === "dangerous") {
        const danger = Math.random();
        if (danger > 0.8) {
          const lostHitpoints = Math.floor(Math.random() * 5) + 1;
          attacker.hitpoints -= lostHitpoints;
          refreshHitpoints();
          message(`${attacker.name} hurt itself for ${lostHitpoints} HP!`);
        }
      }

      // After delay: Check if attacker is still alive. If not, end turn. If so, continue attack.
      setTimeout(() => {
        if (attacker.hitpoints < 1) {
          return endTurn(attacker, defender);
        } else {
          const attackSpeed = attack.speedLevel === "slow" ? 1 : 2;
          const didAttackHit =
            attackSpeed +
              attacker.speedLevel * Math.random() -
              defender.speedLevel * Math.random() >
            0.5;
          if (didAttackHit === false) {
            message(`${defender.name} dodged the attack!`);
          } else {
            const attackStrength = attack.strengthLevel === "weak" ? 3 : 5;
            const attackDamage = Math.floor(
              attackStrength * Math.random() * attacker.strengthLevel + 1
            );
            defender.hitpoints -= attackDamage;
            defender.image.classList.add(
              "animate__animated",
              "animate__headShake"
            );
            refreshHitpoints();
            message(`${defender.name} was hit for ${attackDamage} HP`);
          }
          if (attacker === ourPet) message(`------------------------------`);
        }

        // After delay, end the turn.
        setTimeout(() => {
          endTurn(attacker, defender);
        }, delay);
      }, delay);
    }, delay);
  };

  refreshHitpoints();

  ourPet.availableAttacks.forEach((attack) => {
    const attackDiv = document.createElement("div");
    attackDiv.innerHTML = `<h6>${attack.name}</h6><p>${attack.speed} / ${attack.safety} / ${attack.impact}</p>`;
    attackDiv.setAttribute("data-attack", attacks.indexOf(attack));
    attackDiv.classList.add("attack", "attack-active");
    attacksDiv.appendChild(attackDiv);
    attackDiv.addEventListener("click", () => {
      battleTurn(ourPet, opponent, attack);
    });
  });
};

fight();
