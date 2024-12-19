const cardContainer = document.getElementById("container");

const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemonLimit = 50;
let offset = 0;
let currentInfo = [];

const fetchPokemonList = async () => {
  try {
    const res = await fetch(`${pokemonUrl}?limit=${pokemonLimit}&offset=${offset}`, { cache: "force-cache" }); // grabs list of pokemon names and urls for specific information
    const data = await res.json();
    console.log(data.results);
    fetchPokemonSpecifics(data.results); //passes in an array of pokemon based on limit and offset in fetch request
  } catch (err) {
    console.log(err);
  }
};

fetchPokemonList()


const fetchPokemonSpecifics = async (pokemonArr) => {

  currentInfo = await Promise.all(pokemonArr.map(item => fetch(item.url, { cache: "force-cache"}).then(res => res.json() )));
  //console.log(currentInfo);

  currentInfo.forEach(pokemon => {
    const card = document.createElement("div");  //creating a div element manually / addEventListener would not work with template literal
    card.id = pokemon.id;
    card.classList.add("infoBox");

    const mainContent = document.createElement("div");
    mainContent.id = `main${pokemon.id}`;
    mainContent.classList.add("mainContent");

    //placing the content within another div below makes it easier to move and add content when expanding the card
    mainContent.innerHTML += `
        <p class="name">${pokemon.name}</p>
        <img id="img${pokemon.id}" src="${pokemon.sprites.front_default}" />
        <p>#${pokemon.id}</p>
    `;

    card.appendChild(mainContent);

    const typesContainer = document.createElement("div");

    pokemon.types.forEach(type => { // adding type images at bottom of each card
      typesContainer.innerHTML += `
        <img class="cardTypes" src="./images/${type.type.name}.png" />
      `;
    });

    mainContent.appendChild(typesContainer);

    cardContainer.appendChild(card); //adding card to main container

    card.addEventListener("click",  () => { //div's click event, passing along pokemon's entire object information
      if (card.className === "infoBox") {
        expandCard(pokemon, card);
      } 
    });
  });
  

}

const expandCard = (pokemon, card) => {
  card.classList.remove("infoBox");
  card.classList.add("infoBoxExpanded");
  console.log(pokemon, card);

  //adding close btn
  const closeBtn = document.createElement("img");
  closeBtn.classList.add("closeBtn");
  closeBtn.src = "./images/closeButton.png";
  closeBtn.addEventListener("click", (event) => {
    closeCard(card);
    event.stopPropagation();//this prevents 'clicking through' the X and activating the expandCard function again
  });
  card.appendChild(closeBtn);

  //adding additional pokemon info
  const additionalInfo = document.createElement("div");
  additionalInfo.classList.add("additionalInfo");
  additionalInfo.innerHTML = `
    <div>
      <label for="sprites${pokemon.id}">Sprites: </label>
      <select id="sprites${pokemon.id}">
        <option value="${pokemon.sprites.front_default}">Front Default</option>
        <option value="${pokemon.sprites.front_shiny}">Front Shiny</option>
        <option value="${pokemon.sprites.back_default}">Back Default</option>
        <option value="${pokemon.sprites.back_shiny}">Back Shiny</option>
      </select>
    </div>
    <div>
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Base Experience: ${pokemon.base_experience}xp</p>
    </div>
  `;
  card.appendChild(additionalInfo);
  const selection = document.getElementById(`sprites${pokemon.id}`);
  selection.addEventListener("change", () => {
    document.getElementById(`img${pokemon.id}`).src = selection.value;
  })

  //adding potential abilities
  const abilities = document.createElement("div");
  abilities.classList.add("abilities");
  const abilityList = pokemon.abilities;
  abilityList.forEach(ability => {
    if (ability.is_hidden) {
      abilities.innerHTML += `
        <div>
          <p>${ability.ability.name}</p>
          <p class="hiddenAbility">(Hidden)</p>
        </div>
      `;
    } else {
      abilities.innerHTML += `
        <div>
          <p>${ability.ability.name}</p>
        </div>
      `
    }
  })
  card.appendChild(abilities);

  //adding games list
  const games = document.createElement("div");
  games.classList.add("games");
  const gamesList = pokemon.game_indices;
  gamesList.forEach(game => {
    games.innerHTML += `
    <p>${game.version.name}</p>
    `;
  });
  card.appendChild(games);

  //adding available moves list
  const moves = document.createElement("div");
  moves.classList.add("moves");
  const movesList = pokemon.moves;
  movesList.forEach(move => {
    moves.innerHTML += `
      <p>${move.move.name}</p>
    `;
  });
  card.appendChild(moves);

  //adding base stats
  const stats = document.createElement("div");
  stats.classList.add("stats");
  stats.innerHTML = `
    <div class="hp">
      <p>HP</p>
      <p>${pokemon.stats[0].base_stat}</p>
    </div>
    <div class="attack">
      <p>Att</p>
      <p>${pokemon.stats[1].base_stat}</p>
    </div>
    <div class="defence">
      <p>Def</p>
      <p>${pokemon.stats[2].base_stat}</p>
    </div>
    <div class="spAttack">
      <p>Sp. Att</p>
      <p>${pokemon.stats[3].base_stat}</p>
    </div>
    <div class="spDefence">
      <p>Sp. Def</p>
      <p>${pokemon.stats[4].base_stat}</p>
    </div>
    <div class="speed">
      <p>Speed</p>
      <p>${pokemon.stats[5].base_stat}</p>
    </div>
  `;
  card.appendChild(stats);

  //adding cry sounds
  const cries = document.createElement("div");
  cries.classList.add("cries");
  cries.innerHTML = `
    <audio controls>
      <source src="${pokemon.cries.latest}" type="audio/ogg">
    </audio>
  `;
  card.appendChild(cries);
}

const closeCard = card => {
  const children = new Array(...card.children); //creates an array of all child elements from card

  children.forEach(child => { //loops through all children, if child is not mainContent then delete
    if (child.className != "mainContent") {
      child.remove();
    }
  })

  card.classList.remove("infoBoxExpanded"); //return card to normal state
  card.classList.add("infoBox");
}