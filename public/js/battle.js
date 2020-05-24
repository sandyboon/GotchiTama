const attacks = [
  { name: 'Strike', speed: 'slow', safety: 'safe', impact: 'weak' },
  { name: 'Bodyslam', speed: 'fast', safety: 'safe', impact: 'weak' },
  { name: 'Tackle', speed: 'slow', safety: 'safe', impact: 'strong' },
  { name: 'Lunge', speed: 'fast', safety: 'dangerous', impact: 'strong' },
];

const declareWinner = (winner) => {
  console.log(`The battle is won by ${winner.name}!`);
};

const battleTurn = (attacker, defender, attack) => {
  if (attack.safety === 'dangerous') {
    const danger = Math.random();
    if (danger > 0.8) {
      const lostHitpoints = Math.floor(Math.random() * 5) + 1;
      attacker.hitpoints -= lostHitpoints;
      console.log(
        `${attacker.name} hurt itself for ${lostHitpoints} HP!
          Its hitpoints are now ${attacker.hitpoints}`
      );
    }
  }
  const attackSpeed = attack.speed === 'slow' ? 1 : 2; // slow then speed 1, if fast then speed 2.
  const didAttackHit =
    attackSpeed +
      attacker.speed * Math.random() -
      defender.speed * Math.random() >
    0.5;
  if (didAttackHit === false) {
    console.log(`${defender.name} dodged the attack!`);
  } else {
    const attackStrength = attack.strength === 'weak' ? 3 : 5; // weak then strength 3. if strong then strength 5.
    const attackDamage = Math.floor(
      attackStrength * Math.random() * attacker.strength + 1
    );
    defender.hitpoints -= attackDamage;
    console.log(`${defender.name} was hit for ${attackDamage} HP`);
  }

  if (attacker.hitpoints < 1) declareWinner(defender);
  if (defender.hitpoints < 1) declareWinner(attacker);
};

const fight = async () => {
  // let ourPet = await fetch(someurl);
  // let opponent = await fetch(someurl);
  const ourPet = await {
    name: 'Our_Pet',
    stage: 1,
    health: 10,
    strength: 10,
    speed: 10,
    strengthExp: 200,
    healthExp: 200,
    imageUrl: 'some_image.png',
  };

  const opponent = await {
    name: 'Other_Pet',
    stage: 1,
    health: 9,
    strength: 12,
    speed: 8,
    strengthExp: 186,
    healthExp: 263,
    imageUrl: 'some_other_image.png',
  };

  //   document
  //     .getElementById("our-pet-image")
  //     .setAttribute("background-image", ourPet.imageUrl);
  //   document
  //     .getElementById("opponent-image")
  //     .setAttribute("background-image", opponent.imageUrl);

  ourPet.availableAttacks = getAvailableAttacks(ourPet);
  ourPet.hitpoints = ourPet.health * 10;

  opponent.availableAttacks = getAvailableAttacks(opponent);
  opponent.hitpoints = opponent.health * 10;
  ourPet.availableAttacks.forEach((attack) => {
    const attackDiv = document.createElement('div');
    attackDiv.innerHTML = `<h3>${attack.name}</h3><p>${attack.speed}/${attack.safety}/${attack.impact}</p>`;
    document.getElementById('attacks').appendChild(attackDiv);

    // attack(ourPet, opponent, attacks[3]);
    attackDiv.addEventListener('click', () => {
      battleTurn(ourPet, opponent, attack);
    });
  });
};

fight();

function getAvailableAttacks() {
  return (pet) => {
    const availableAttacks = [];
    switch (pet.stage) {
      case 1:
        availableAttacks.push(attacks[0]);
        availableAttacks.push(attacks[1]);
        break;
      case 2:
        availableAttacks.push(attacks[0]);
        availableAttacks.push(attacks[1]);
        availableAttacks.push(attacks[2]);
        break;
      case 3:
        availableAttacks.push(attacks[0]);
        availableAttacks.push(attacks[1]);
        availableAttacks.push(attacks[2]);
        availableAttacks.push(attacks[3]);
        break;
    }
    return availableAttacks;
  };
}
