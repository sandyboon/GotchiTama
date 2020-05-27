(async () => {
  const foo = await fetch('api/getAllOpponents');
  const bar = await foo.json();
  const opponents = bar.allOpponents;
  console.log(foo);
  console.log(opponents);
  // const opponents = [
  //   {
  //     id: 1,
  //     name: "Fluffy",
  //     stage: 3,
  //     type: 4,
  //     healthLevel: 9,
  //     strengthLevel: 1,
  //     speedLevel: 8,
  //   },
  //   {
  //     id: 2,
  //     name: "Flippy",
  //     stage: 1,
  //     type: 3,
  //     healthLevel: 3,
  //     strengthLevel: 12,
  //     speedLevel: 8,
  //   },
  //   {
  //     id: 3,
  //     name: "Floofers",
  //     stage: 1,
  //     type: 2,
  //     healthLevel: 9,
  //     strengthLevel: 13,
  //     speedLevel: 8,
  //   },
  //   {
  //     id: 4,
  //     name: "Mittens",
  //     stage: 2,
  //     type: 1,
  //     healthLevel: 5,
  //     strengthLevel: 2,
  //     speedLevel: 3,
  //   },
  // ];

  const opponentsDiv = document.getElementById('opponents');
  const battleButton = document.getElementById('battle-button');

  opponents.forEach((opponent) => {
    const anOpponent = document.createElement('div');
    anOpponent.classList.add('opponent');
    anOpponent.innerHTML = `<img style="width: 15rem; height: 15rem" src='./images/pets/colour${
      opponent.type
    }-stage${opponent.stage}-happy.png'>
    <div style="min-width: 140px; margin: 20px;"><p><b>${
      opponent.name
    }</b><br />Hitpoints:&nbsp;${opponent.healthLevel * 10} Strength:&nbsp;${
      opponent.strengthLevel
    } Speed:&nbsp;${opponent.speedLevel}</p></div>`;
    opponentsDiv.appendChild(anOpponent);
    anOpponent.addEventListener('click', (event) => {
      const allOpponentsDivs = document.getElementsByClassName('opponent');
      [...allOpponentsDivs].forEach((div) =>
        div.classList.remove('opponent-active')
      );
      anOpponent.classList.add('opponent-active');
      battleButton.classList.remove('button-disabled');
      battleButton.setAttribute('href', `/battle?opponent=${opponent.id}`);
    });
  });
})();
