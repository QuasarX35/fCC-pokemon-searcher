/* -------------------------------------------------------------------------- */
/*                          version to pass fcc tests                         */
/* -------------------------------------------------------------------------- */

const pokemonCount = document.getElementById('pokemon-count');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-button');
const imgContainer = document.querySelector('.img-container');
const pokemonName = document.getElementById('pokemon-name');
const pokemonId = document.getElementById('pokemon-id');
const pokemonWeight = document.getElementById('weight');
const pokemonHeight = document.getElementById('height');
const pokemonTypes = document.getElementById('types');
const pokemonHp = document.getElementById('hp');
const pokemonAttack = document.getElementById('attack');
const pokemonDefense = document.getElementById('defense');
const pokemonSpecialAttack = document.getElementById('special-attack');
const pokemonSpecialDefense = document.getElementById('special-defense');
const pokemonSpeed = document.getElementById('speed');

const pokemonListUrl = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon';

const fetchData = async () => {
    try {
        const inputValue = searchInput.value.toLowerCase();
        const res = await fetch(`${pokemonListUrl}/${inputValue}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await res.json();

        displayPokemon(data);

        return;
    } catch (err) {
        alert('Pokémon not found');
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
    const imgElExists = document.getElementById('sprite');
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
        elToAdd.setAttribute('alt', 'a pokemon\'s front default sprite');
        elToAdd.id = 'sprite';
    }

    imgContainer.removeAttribute('hidden');
    imgContainer.style.display = 'flex';
    imgContainer.insertBefore(elToAdd, imgContainer.firstChild);
}

const displayPokemonTypes = types => {
    pokemonTypes.innerHTML = '';
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
        pokemonTypes.appendChild(typeSpan);
    });
}

const displayPokemon = pokemon => {
    const { sprites, name, id, weight, height, types, stats } = pokemon;

    const statsContainer = document.querySelector('.stats-container');
    statsContainer.removeAttribute('hidden');
    statsContainer.style.display = 'flex';

    displayPokemonImg(sprites.front_default);
    pokemonName.textContent = name.toUpperCase();
    pokemonId.textContent = id;
    pokemonWeight.textContent = weight;
    pokemonHeight.textContent = height;
    displayPokemonTypes(types);
    pokemonHp.textContent = stats[0].base_stat;
    pokemonAttack.textContent = stats[1].base_stat;
    pokemonDefense.textContent = stats[2].base_stat;
    pokemonSpecialAttack.textContent = stats[3].base_stat;
    pokemonSpecialDefense.textContent = stats[4].base_stat;
    pokemonSpeed.textContent = stats[5].base_stat;
}

const checkInput = e => {
    e.preventDefault();
    const input = searchInput.value;
    if (!input || !input.length || isWhitespacesOnly(input)) {
        displayError("Invalid input. Please enter a value.");
        searchInput.value = "";
        return;
    }

    fetchData();
}

searchBtn.addEventListener('click', checkInput);