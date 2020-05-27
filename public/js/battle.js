const attacks = [
  { name: "Strike", speed: "slow", safety: "safe", impact: "weak" },
  { name: "Bodyslam", speed: "fast", safety: "safe", impact: "weak" },
  { name: "Tackle", speed: "slow", safety: "safe", impact: "strong" },
  { name: "Lunge", speed: "fast", safety: "dangerous", impact: "strong" },
];

const declareWinner = (winner) => {
  console.log(`The battle is won by ${winner.name}!`);
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
  // let ourPet = await fetch(someurl);
  // let opponent = await fetch(someurl);
  const ourPet = await {
    name: "Our_Pet",
    stage: 3,
    health: 10,
    strength: 10,
    speed: 10,
    strengthExp: 200,
    healthExp: 200,
    imageUrl: "some_image.png",
  };
  ourPet.availableAttacks = getAvailableAttacks(ourPet);
  ourPet.hitpoints = ourPet.health * 10;
  document.getElementById("our-pet-name").innerHTML = ourPet.name;
  const ourPetHitpoints = document.getElementById("our-pet-hitpoints");
  document.getElementById("our-pet-speed").innerHTML = "Speed: " + ourPet.speed;
  document.getElementById("our-pet-strength").innerHTML =
    "Strength: " + ourPet.strength;

  const opponent = await {
    name: "Other_Pet",
    stage: 3,
    health: 9,
    strength: 12,
    speed: 8,
    strengthExp: 186,
    healthExp: 263,
    imageUrl: "some_other_image.png",
  };

  opponent.availableAttacks = getAvailableAttacks(opponent);
  opponent.hitpoints = opponent.health * 10;
  document.getElementById("other-pet-name").innerHTML = opponent.name;
  const opponentHipoints = document.getElementById("other-pet-hitpoints");
  document.getElementById("other-pet-speed").innerHTML =
    "Speed: " + opponent.speed;
  document.getElementById("other-pet-strength").innerHTML =
    "Strength: " + opponent.strength;

  const refreshHitpoints = () => {
    opponentHipoints.innerHTML = `HP: ${opponent.hitpoints} / ${
      opponent.health * 10
    }`;
    ourPetHitpoints.innerHTML = `HP: ${ourPet.hitpoints} / ${
      ourPet.health * 10
    }`;
  };

  const battleTurn = (attacker, defender, attack) => {
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
      console.clear();
      [...document.getElementsByClassName("attack")].forEach((button) => {
        button.classList.remove("attack-active");
      });
      document.querySelector(
        ".attack"
      ).parentElement.innerHTML = document.querySelector(
        ".attack"
      ).parentElement.innerHTML;
    }

    console.log(`${attacker.name} uses ${attack.name}`);

    // After delay: Check if attacker hurt itself while attempting to attack
    setTimeout(() => {
      if (attack.safety === "dangerous") {
        const danger = Math.random();
        if (danger > 0.8) {
          const lostHitpoints = Math.floor(Math.random() * 5) + 1;
          attacker.hitpoints -= lostHitpoints;
          refreshHitpoints();
          console.log(
            `${attacker.name} hurt itself for ${lostHitpoints} HP!
            Its hitpoints are now ${attacker.hitpoints}`
          );
        }
      }

      // After delay: Check if attacker is still alive. If not, end turn. If so, continue attack.
      setTimeout(() => {
        if (attacker.hitpoints < 1) {
          return endTurn(attacker, defender);
        } else {
          const attackSpeed = attack.speed === "slow" ? 1 : 2;
          const didAttackHit =
            attackSpeed +
              attacker.speed * Math.random() -
              defender.speed * Math.random() >
            0.5;
          if (didAttackHit === false) {
            console.log(`${defender.name} dodged the attack!`);
          } else {
            const attackStrength = attack.strength === "weak" ? 3 : 5;
            const attackDamage = Math.floor(
              attackStrength * Math.random() * attacker.strength + 1
            );
            defender.hitpoints -= attackDamage;
            refreshHitpoints();
            console.log(`${defender.name} was hit for ${attackDamage} HP`);
          }
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
    attackDiv.innerHTML = `<h3>${attack.name}</h3><p>${attack.speed}/${attack.safety}/${attack.impact}</p>`;
    attackDiv.setAttribute("data-attack", attacks.indexOf(attack));
    attackDiv.classList.add("attack", "attack-active");
    document.getElementById("attacks").appendChild(attackDiv);
    attackDiv.addEventListener("click", () => {
      battleTurn(ourPet, opponent, attack);
    });
  });
};

fight();
