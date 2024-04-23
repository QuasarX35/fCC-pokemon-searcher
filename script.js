// personal version - did not pass fcc automated tests but has similar output

const pokemonCount = document.getElementById('pokemon-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const imgContainer = document.querySelector('.img-container');
const pokemonAttrEls = {
    name: document.getElementById('pokemon-name'),
    id: document.getElementById('pokemon-id'),
    weight: document.getElementById('weight'),
    height: document.getElementById('height'),
    types: document.getElementById('types'),
    hp: document.getElementById('hp'),
    attack: document.getElementById('attack'),
    defense: document.getElementById('defense'),
    specialAttack: document.getElementById('special-attack'),
    specialDefense: document.getElementById('special-defense'),
    speed: document.getElementById('speed')
};

const pokemonListUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon';
let pokemonNames = [];

const fetchData = async () => {
    try {
        const res = await fetch(pokemonListUrl);
        const data = await res.json();

        pokemonCount.textContent = `Pokémon Count (w/ forms): ${data.count}`;

        pokemonNames = data.results.map(pokemon => pokemon.name);
    } catch (err) {
        console.log(`Error fetching pokemon list: ${err}`);
    }
};

const displayError = errorMsg => {
    const errorMsgExists = document.querySelector('.errorMsg');
    if (errorMsgExists) return;

    const errorMsgEl = document.createElement('span');
    errorMsgEl.textContent = errorMsg;
    errorMsgEl.classList.add('error');
    errorMsgEl.classList.add('errorMsg');

    searchInput.parentNode.insertBefore(errorMsgEl, searchInput.nextSibling);

    setTimeout(() => {
        errorMsgEl.remove();
    }, '3000');
}

// https://stackoverflow.com/questions/10261986/how-to-detect-string-which-contains-only-spaces
const isWhitespacesOnly = str => !str.replace(/\s/g, '').length;

const cleanInput = str => str.trim().replace(/\s+/g, '-').toLowerCase();

const searchPokemon = (str, pokemonNames) => {
    const intRegex = /^\d+$/;
    if (intRegex.test(str)) {
        const index = parseInt(str) - 1;
        return index >= 0 && index <= pokemonNames.length
            ? pokemonNames[index]
            : null;
    } else {
        return pokemonNames.find(pokemonName => pokemonName.includes(str));
    }
}

const displayPokemonImg = spriteUrl => {
    const imgElExists = document.getElementById('pokemon-img');
    if (imgElExists) {
        imgElExists.remove();
    }

    const noImgSpanExists = document.getElementById('no-img');
    if (noImgSpanExists) {
        noImgSpanExists.remove();
    }

    let elToAdd;

    if (!spriteUrl) {
        elToAdd = document.createElement('span');
        elToAdd.textContent = `No Image`;
        elToAdd.id = 'no-img';
    } else {
        elToAdd = document.createElement('img');
        elToAdd.setAttribute('src', spriteUrl);
        elToAdd.setAttribute('alt', 'a pokemon');
        elToAdd.id = 'pokemon-img';
    }

    imgContainer.removeAttribute('hidden');
    imgContainer.style.display = 'flex';
    imgContainer.insertBefore(elToAdd, imgContainer.firstChild);
}

const displayPokemonTypes = types => {
    pokemonAttrEls.types.innerHTML = '';
    types.forEach(typeObj => {
        const typeName = typeObj.type.name.toLowerCase();
        const typeSpan = document.createElement('span');
        typeSpan.classList.add = `type-${typeName}`;
        typeSpan.style.fontSize = `0.8rem`;
        typeSpan.style.backgroundColor = `var(--type-${typeName})`;
        typeSpan.style.color = `white`;
        typeSpan.style.padding = `.3em`;
        typeSpan.style.borderRadius = `5px`;
        typeSpan.style.boxShadow = `2px 2px 5px gray`;
        typeSpan.style.textShadow = `2px 2px 5px gray`;
        typeSpan.textContent = typeName.toUpperCase();
        pokemonAttrEls.types.appendChild(typeSpan);
    });
}

const displayPokemon = pokemon => {
    const { sprites, name, id, weight, height, types, stats } = pokemon;
    console.log(sprites);

    const statsContainer = document.querySelector('.stats-container');
    statsContainer.removeAttribute('hidden');
    statsContainer.style.display = 'flex';

    displayPokemonImg(sprites.front_default);
    const capName = name.split('-').map(word => word[0].toUpperCase() + word.substr(1));
    pokemonAttrEls.name.textContent = capName.length > 1
        ? capName[0] + ' (' + capName.slice(1).join(' ') + ')'
        : capName[0];
    pokemonAttrEls.id.textContent = id;
    pokemonAttrEls.weight.textContent = weight;
    pokemonAttrEls.height.textContent = height;
    displayPokemonTypes(types);
    pokemonAttrEls.hp.textContent = stats[0].base_stat;
    pokemonAttrEls.attack.textContent = stats[1].base_stat;
    pokemonAttrEls.defense.textContent = stats[2].base_stat;
    pokemonAttrEls.specialAttack.textContent = stats[3].base_stat;
    pokemonAttrEls.specialDefense.textContent = stats[4].base_stat;
    pokemonAttrEls.speed.textContent = stats[5].base_stat;
}

const fetchPokemon = async pokemonName => {
    try {
        const res = await fetch(`http://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonName}`);
        const data = await res.json();

        displayPokemon(data);

        return;
    } catch (err) {
        console.log(`Error fetching pokemon data: ${err}`);
    }
}

const checkInput = e => {
    e.preventDefault();
    const input = searchInput.value;
    if (!input || !input.length || isWhitespacesOnly(input)) {
        displayError("Invalid input. Please enter a value.");
        searchInput.value = "";
        return;
    }

    const searchResult = searchPokemon(cleanInput(input), pokemonNames);
    if (!searchResult) {
        alert("Pokémon not found");
    } else {
        fetchPokemon(searchResult);
    }
}

fetchData();

searchBtn.addEventListener('click', checkInput);