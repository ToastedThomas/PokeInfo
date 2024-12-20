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
    createPaginationControls();//updates page controls
  } catch (err) {
    console.log(err);
  }
};

fetchPokemonList()


const fetchPokemonSpecifics = async (pokemonArr) => {
  cardContainer.innerHTML = ""; //clears content when loading new data

  currentInfo = await Promise.all(pokemonArr.map(item => fetch(item.url, { cache: "force-cache"}).then(res => res.json() )));

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

  //adding additional pokemon info
  const additionalInfo = document.createElement("div");
  additionalInfo.id = `additionalInfo${pokemon.id}`;
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
  setTimeout(() => {//adding a 500ms delay on finding/adding eventlistener to element, to make sure the element is actually in the DOM before attempting to grab it
    const selection = document.getElementById(`sprites${pokemon.id}`);
    selection.addEventListener("change", () => {
      document.getElementById(`img${pokemon.id}`).src = selection.value;
    });
  }, 500);

  const typeDiv = document.createElement("div");
  typeDiv.classList.add("types");
  const typesList = pokemon.types;
  typeDiv.innerHTML = `<span>Types: </span>`
  typesList.forEach((type, i) => {
    typeDiv.innerHTML += `<span>${type.type.name.toUpperCase()}</span>`;
    if (i != typesList.length - 1) {
      typeDiv.innerHTML += `<span>, </span>`;
    };
  });
  document.getElementById(`additionalInfo${pokemon.id}`).appendChild(typeDiv);


  //adding potential abilities
  const abilities = document.createElement("div");
  abilities.classList.add("abilities");
  abilities.innerHTML += `
    <h4 class="sectionTitle">Potential Abilities</h4>
  `;
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
  games.innerHTML += `
    <h4 class="sectionTitle">Games found in</h4>
  `;
  const gamesList = pokemon.game_indices;
  gamesList.forEach((game, i) => {
    games.innerHTML += `
    <p>${game.version.name}</p>
    `;
    if (i != gamesList.length - 1) {
      games.innerHTML += `<hr>`;
    };
  });
  card.appendChild(games);

  //adding available moves list
  const moves = document.createElement("div");
  moves.classList.add("moves");
  moves.innerHTML += `
    <h4 class="sectionTitle">Available Moves</h4>
  `;
  const movesList = pokemon.moves;
  movesList.forEach((move, i) => {
    moves.innerHTML += `
      <p>${move.move.name}</p>
    `;
    if (i != movesList.length - 1) {
      moves.innerHTML += `<hr>`;
    };
  });
  card.appendChild(moves);

  //adding base stats
  const stats = `
    <div class="stats">
    <h4 class="sectionTitle">Base Stats</h4>
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
    </div>
  `;
  card.innerHTML += stats;

  //adding cry sounds
  const cries = `
    <div class="cries">
    <h4 class="sectionTitle">Cry Sound</h4>
      <audio controls>
        <source src="${pokemon.cries.latest}" type="audio/ogg">
      </audio>
    </div>
  `;
  card.innerHTML += cries;

  //adding close btn
  const closeBtn = `
    <img id="closeBtn" src="./images/closeButton.png" />
  `;
  card.innerHTML += closeBtn;
  const closeBtnImg = document.getElementById("closeBtn");
  closeBtnImg.addEventListener("click", (event) => {
    closeCard(card);
    event.stopPropagation();//this prevents 'clicking through' the X and activating the expandCard function again
  });
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

const createPaginationControls = () => {
  paginationContainer.innerHTML = ""; // Clear previous pagination controls
  const totalPages = Math.ceil(1302 / pokemonLimit);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if ((i - 1) * pokemonLimit === offset) {
      button.classList.add("active"); // Highlight the active page
      button.disabled = true;
    }
    button.addEventListener("click", () => changePage(i));
    paginationContainer.appendChild(button);
  }
};

const changePage = pageNumber => {
  offset = (pageNumber - 1) * pokemonLimit;
  fetchPokemonList();
}