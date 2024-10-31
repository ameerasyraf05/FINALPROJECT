let itineraries = JSON.parse(localStorage.getItem('itineraries')) || [];
let currentEditId = null;
let allCountries = []; 

// Fetch Country Data with Loading Spinner
async function fetchCountryData() {
    // Show loading spinner
    document.getElementById('loading').style.display = 'block';
    
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        displayCountryData(countries);
    } catch (error) {
        console.error('Error fetching country data:', error);
    } finally {
        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';
    }
}

// Display Country Data
function displayCountryData(countries) {
    const container = document.getElementById('country-data');
    container.innerHTML = '';  // Clear previous data
    
    countries.forEach(country => {
        const countryDiv = document.createElement('div');
        countryDiv.classList.add('country');
        
        // Displaying country details
        countryDiv.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Area:</strong> ${country.area ? `${country.area} km²` : 'N/A'}</p>
            <p><strong>Continent:</strong> ${country.continents ? country.continents[0] : 'N/A'}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Subregion:</strong> ${country.subregion || 'N/A'}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Language(s):</strong> ${Object.values(country.languages || {}).join(', ')}</p>
            <p><strong>Time Zone(s):</strong> ${country.timezones.join(', ')}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Location:</strong> Lat: ${country.latlng[0]}, Lng: ${country.latlng[1]}</p>
            <p><strong>Flag:</strong></p>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
            ${country.coatOfArms ? `<p><strong>Coat of Arms:</strong></p><img src="${country.coatOfArms.png}" alt="Coat of Arms of ${country.name.common}" width="100">` : ''}
            <h2>${country.name.common}</h2>
            <p><strong>Currency:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
            <p><strong>Demonym:</strong> ${country.demonyms ? country.demonyms.eng.m : 'N/A'}</p>
            <p><strong>Bordering Countries:</strong> ${country.borders ? country.borders.join(', ') : 'N/A'}</p>
            <p><strong>Maps:</strong> <a href="${country.maps.googleMaps}" target="_blank">View on Google Maps</a></p>
        `;
        
        container.appendChild(countryDiv);
    });
}



// CRUD Functions for Itineraries
function addOrUpdateItinerary() {
    const country = document.getElementById('country-name').value;
    const notes = document.getElementById('notes').value;

    if (!country || !notes) {
        alert('Please enter both the country name and notes.');
        return;
    }

    if (currentEditId) {
        console.log("Updating itinerary with ID:", currentEditId); // Debugging line
        const index = itineraries.findIndex(item => item.id === currentEditId);
        itineraries[index] = { id: currentEditId, country, notes };
        alert('Itinerary updated successfully!');
    } else {
        const itinerary = { id: Date.now(), country, notes };
        itineraries.push(itinerary);
        alert('Itinerary added successfully!');
    }

    localStorage.setItem('itineraries', JSON.stringify(itineraries));
    renderItineraries();
    closeModal();
    clearForm();
}



function renderItineraries() {
    const list = document.getElementById('itinerary-list');
    list.innerHTML = '';  // Clear previous items

    itineraries.forEach(itinerary => {
        // Create the card container for each itinerary
        const card = document.createElement('div');
        card.classList.add('itinerary-card'); // Apply card styling

        // Add content to the card
        card.innerHTML = `
            <strong>${itinerary.country}</strong> - ${itinerary.notes}
        `;

        // Create Edit and Delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('card-button');
        editButton.onclick = () => editItinerary(itinerary.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('card-button');
        deleteButton.onclick = () => deleteItinerary(itinerary.id);

        // Append buttons to the card
        card.appendChild(editButton);
        card.appendChild(deleteButton);

        // Append the card to the itinerary list container
        list.appendChild(card);
    });
}


function deleteItinerary(id) {
    itineraries = itineraries.filter(itinerary => itinerary.id !== id);
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
    renderItineraries();
    alert('Itinerary deleted successfully!');
}

function editItinerary(id) {
    currentEditId = id;
    const itinerary = itineraries.find(item => item.id === id);
    console.log("Editing itinerary:", itinerary); // Debugging line

    if (itinerary) {
        document.getElementById('country-name').value = itinerary.country;
        document.getElementById('notes').value = itinerary.notes;
        openModal(); // Open modal for editing
    }
}




// Modal Management
function openModal() {
    document.getElementById("itineraryModal").style.display = "block";
}


function closeModal() {
    document.getElementById("itineraryModal").style.display = "none";
    clearForm();
}

function clearForm() {
    document.getElementById('country-name').value = '';
    document.getElementById('notes').value = '';
    currentEditId = null; // Important to reset after each add/update
}


// Initial render on load
renderItineraries();
