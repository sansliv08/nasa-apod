const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// NASA API
const count = 10;
const api_key = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&count=${count}`;

let resultsArray = [];
let favorites = {}; // more easy to delete a item from a object

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'});
    loader.classList.add('hidden');
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    // console.log('Current Array: ', page, currentArray);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Title
        const title = document.createElement('h5');
        title.textContent = result.title;
        title.classList.add('card-title');
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results') {
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`); // url is unic
        } else {
            saveText.textContent = 'Remove Favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`); // url is unic
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(title, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        // console.log(card);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        // console.log('favorites from localstorage: ', favorites);
    }
    imagesContainer.textContent = ''; // Remove all elements - reset all
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NAsa API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        // console.log(resultsArray);
        updateDOM('results');
    } catch (error) {
        // Catch Error Here
        console.log('Whooops!', error);
    }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    // console.log(itemUrl);
    // Loop throught results Ary to select Favorite
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // console.log(JSON.stringify(favorites));
            // Show Save confirmation for 2seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }  
    })
}

// Delete result from Favorites
function removeFavorite(itemUrl) {
    if(favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// On Load
getNasaPictures();