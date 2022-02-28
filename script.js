
fetch('https://pokeapi.co/api/v2/pokemon/?limit=250', {cache: "force-cache"})//grabs basic pokemon info including name and url for more info
  .then( response => {
    return response.json();//converts raw json into readable format
  }).then( json => {
    console.log(json);
    displayUsers(json);//passes name and url info into function below
  })

function displayUsers(info) {
  info.results.forEach(element => {//loops through each pokemon loaded above and creates elements to house information about pokemon, then requests more info about each pokemon below
    var img = document.createElement('img');
    const box = document.createElement('div');
    const typeBox = document.createElement('div');
    var idNum = document.createElement('p');
    const idNumBox = document.createElement('div');
    var name = document.createElement('p');
    const nameBox = document.createElement('div');
    nameBox.setAttribute('id', 'nameBox');
    idNumBox.setAttribute('id', 'idNumBox');
    typeBox.setAttribute('id', 'typeBox');
    nameBox.appendChild(name);
    idNumBox.appendChild(idNum);
    box.appendChild(img);
    box.appendChild(nameBox);
    box.appendChild(idNumBox);
    box.appendChild(typeBox);
    fetch(element.url, {cache: "force-cache"})//grabs more specific info for each pokemon
      .then( response => {
        return response.json();
      }).then( json => {//takes current readable info about pokemon and uses it
        img.src = json.sprites.front_default;
        if (json.id < 10) {//takes pokemon id number and makes it look uniform
          idNum.innerHTML = '#00'+json.id;
        } else if (10 <= json.id && json.id < 100) {
          idNum.innerHTML = '#0'+json.id;
        } else {
          idNum.innerHTML = '#'+json.id;
        }
        box.setAttribute('id', json.id);//assigns pokemon id number to the id of the element for reference later on
        json.types.forEach(element => {//loops through each type a pokemon has 
          var typeImg = document.createElement('img');
          typeImg.classList.add('typeIcon');
          typeImg.src = 'images/'+element.type.name+'.png';
          typeBox.appendChild(typeImg);
        })
      })
    box.classList.add('infoBox');
    img.classList.add('pokeSprite');
    name.innerHTML = element.name;
    document.getElementById('container').appendChild(box);
    box.onclick = function() {
     expandInfo(box);
    }
    console.log(box);
  });
}

function expandInfo(box) {
  if (!document.getElementById('container').querySelector('.expandedBox')) {
    var closeButton = document.createElement('img');
    var nameTag = document.createElement('p');
    var idTag = document.createElement('p');
    var typesTag = document.createElement('p');
    var heightInfo = document.createElement('p');
    var weightInfo = document.createElement('p');
    var heightTag = document.createElement('p');
    var weightTag = document.createElement('p');
    var abilityTag = document.createElement('h5');
    var statsTag = document.createElement('h5');
    var hiddenTag = document.createElement('h6');
    const heightBox = document.createElement('div');
    const weightBox = document.createElement('div');
    const abilityBox = document.createElement('div');
    const statsBox = document.createElement('div');
    heightBox.setAttribute('id', 'heightBox');
    weightBox.setAttribute('id', 'weightBox');
    abilityBox.setAttribute('id', 'abilityBox');
    statsBox.setAttribute('id', 'statsBox');
    nameTag.innerHTML = 'Name';
    idTag.innerHTML = 'Id no.';
    typesTag.innerHTML = 'Type(s)';
    heightTag.innerHTML = 'Height';
    weightTag.innerHTML = 'Weight';
    abilityTag.innerHTML = 'Abilities';
    hiddenTag.innerHTML = 'Hidden Ability';
    statsTag.innerHTML = 'Stats';
    closeButton.src = 'images/closeButton.png';
    closeButton.classList.add('closeButton');
    heightBox.appendChild(heightTag);
    weightBox.appendChild(weightTag);
    abilityBox.appendChild(abilityTag);
    heightBox.appendChild(heightInfo);
    weightBox.appendChild(weightInfo);
    statsBox.appendChild(statsTag);
    box.appendChild(closeButton);
    box.insertBefore(weightBox, box.childNodes[3]);
    box.insertBefore(heightBox, box.childNodes[3]);
    box.appendChild(abilityBox);
    box.appendChild(statsBox);
    box.classList.remove('infoBox');
    box.classList.add('expandedBox');
    box.firstChild.classList.remove('pokeSprite');
    box.firstChild.classList.add('bigPokeSprite');
    box.querySelector('#typeBox').style.width = '20%';
    box.querySelector('#typeBox').style.margin = '0px 10px 0px auto';
    box.querySelector('#typeBox').style.justifyContent = 'space-between';
    box.querySelector('#typeBox').insertBefore(typesTag, box.querySelector('#typeBox').childNodes[0]);
    box.querySelector('#nameBox').classList.add('nameBox');
    box.querySelector('#nameBox').insertBefore(nameTag, box.querySelector('#nameBox').childNodes[0]);
    box.querySelector('#idNumBox').classList.add('idBox');
    box.querySelector('#idNumBox').insertBefore(idTag, box.querySelector('#idNumBox').childNodes[0]);
    fetch('https://pokeapi.co/api/v2/pokemon/'+box.id, {cache: "force-cache"})
    .then( response => {
      return response.json();//converts raw json into readable format
    }).then( json => {
      heightInfo.innerHTML = (json.height / 10).toFixed(1) + ' m';
      weightInfo.innerHTML = (json.weight / 10).toFixed(1) + ' kg';
      json.abilities.forEach(element => {
        var abilityInfo = document.createElement('p');
        abilityInfo.innerHTML = element.ability.name;
        abilityBox.appendChild(abilityInfo);
        if (element.is_hidden) {
          abilityInfo.appendChild(hiddenTag);
        }
      })
      json.stats.forEach(element => {
        const statHold = document.createElement('div');
        var statName = document.createElement('p');
        var statNum = document.createElement('p');
        statHold.classList.add('smallStatBox');
        statHold.setAttribute('id', element.stat.name);
        statNum.innerHTML = element.base_stat;
        if (element.stat.name === 'hp') {
          statName.innerHTML = 'Hp';
        } else if (element.stat.name === 'attack') {
          statName.innerHTML = 'Atk';
        } else if (element.stat.name === 'defense') {
          statName.innerHTML = 'Def';
        } else if (element.stat.name === 'special-attack') {
          statName.innerHTML = 'SpA';
        } else if (element.stat.name === 'special-defense') {
          statName.innerHTML = 'SpD';
        } else if (element.stat.name === 'speed') {
          statName.innerHTML = 'Spe';
        }
        statHold.appendChild(statName);
        statHold.appendChild(statNum);
        statsBox.appendChild(statHold);
        console.log(element)
      })
      console.log(json);
    })
  closeButton.onclick = function() { 
    box.removeChild(closeButton);
    box.removeChild(heightBox);
    box.removeChild(weightBox);
    box.removeChild(abilityBox);
    box.removeChild(statsBox);
    box.classList.remove('expandedBox');
    box.classList.add('infoBox');
    box.firstChild.classList.remove('bigPokeSprite');
    box.firstChild.classList.add('pokeSprite');
    box.querySelector('#nameBox').classList.remove('nameBox');
    box.querySelector('#nameBox').removeChild(box.querySelector('#nameBox').childNodes[0]);
    box.querySelector('#idNumBox').classList.remove('idBox');
    box.querySelector('#idNumBox').removeChild(box.querySelector('#idNumBox').childNodes[0]);
    box.querySelector('#typeBox').removeChild(box.querySelector('#typeBox').childNodes[0]);
    box.querySelector('#typeBox').lastChild.style.paddingRight = '0px';
    box.querySelector('#typeBox').style.width = '50%';
    box.querySelector('#typeBox').style.margin = '0px auto';
    box.querySelector('#typeBox').style.justifyContent = 'space-around';
    event.stopPropagation();//this line is very important, it prevents the mouse from 'clicking through' the close button, ensures that the box.onclick event doesn't fire again
    console.log('close') }
  }
}