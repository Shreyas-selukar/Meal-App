
const searchInput = document.getElementById('input');
const searchButton = document.getElementById('button');
const searchResults = document.getElementById('results');
const fav = document.getElementById('favourites');
const reset = document.getElementById('reset');

// Initialize array to store fav meals
const favoritesList = [];

searchButton.addEventListener('click', async () => {
  // Get the search query from the input field
  const searchQuery = searchInput.value;

  try {
    // Make an API call to fetch meal data based on the search query
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
    const data = await response.json();

    // No meals
    if (data.meals === null) {
      alert('No meals found for this search query.');
    } else {
      // if meals found
      displaySearchResults(data.meals);
    }
  } catch (error) {
    // Handle any errors that may occur during the API call
    console.error(error);
  }
});

//display meals
function displaySearchResults(meals) {
  // Clear any previous search result
  searchResults.innerHTML = '';

  // Iterate through each meal and create a meal element to display it
  meals.forEach(meal => {
    const mealElement = createMealElement(meal);
    searchResults.appendChild(mealElement);
  });
}

// Function to create a meal element with all the necessary information
function createMealElement(meal) {
  const mealElement = document.createElement('div');
  mealElement.classList.add('meal');

  // meal img
  const mealImage = document.createElement('img');
  mealImage.src = meal.strMealThumb;
  mealImage.alt = meal.strMeal;
  mealElement.appendChild(mealImage);

  // meal name
  const mealName = document.createElement('h2');
  mealName.innerText = meal.strMeal;
  mealElement.appendChild(mealName);

  // list of meal ingredients
  const mealIngredients = document.createElement('ul');
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      const ingredient = document.createElement('li');
      ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
      mealIngredients.appendChild(ingredient);
    }
  }
  mealElement.appendChild(mealIngredients);

  // description
  const mealDescription = document.createElement('p');
  mealDescription.classList.add('description');
  mealDescription.innerText = meal.strInstructions;
  mealElement.appendChild(mealDescription);

  // read more button
  const readMoreButton = document.createElement('button');
  readMoreButton.innerHTML = 'Read More';
  readMoreButton.addEventListener('click', () => {
    mealDescription.classList.toggle('show');
  });
  mealElement.appendChild(readMoreButton);

  //favourites button
  const favoriteButton = document.createElement('button');
  favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
  favoriteButton.addEventListener('click', () => {
    toggleFavorite(meal);
  });
  mealElement.appendChild(favoriteButton);

  return mealElement;
}

// Function to toggle a meal between being a favorite or not
function toggleFavorite(meal) {
  const index = favoritesList.findIndex(fav => fav.idMeal === meal.idMeal);
  if (index === -1) {
    // If the meal is not in favorites, add it
    addToFavorites(meal);
  } else {
    // If the meal is already in favorites, remove it
    removeFromFavorites(index);
  }
}

// add to favourites
function addToFavorites(meal) {
  favoritesList.push(meal);
  alert(`${meal.strMeal} has been added to your favorites.`);
}

// remove from favourites
function removeFromFavorites(index) {
  const meal = favoritesList[index];
  favoritesList.splice(index, 1);
  alert(`${meal.strMeal} has been removed from your favorites.`);
}


fav.addEventListener('click', () => {
  showFav();
});

// show favourite meals
function showFav() {
  searchResults.innerHTML = '';

  if (favoritesList.length === 0) {
    
    const noFavMessage = document.createElement('p');
    noFavMessage.innerText = 'You have no favorite meals.';
    searchResults.appendChild(noFavMessage);
  } else {
    // If there are favorite meals, create a meal element for each one
    favoritesList.forEach(meal => {
      const mealElement = createMealElement(meal);

      // Create the "Remove from Favorites" button
      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove from Favorites';
      removeButton.addEventListener('click', () => {
        removeFromFavorites(favoritesList.indexOf(meal));
      });
      mealElement.appendChild(removeButton);

      searchResults.appendChild(mealElement);
    });
  }
}

// Event listener for the "Clear" button
reset.addEventListener('click', () => {
  // Clear the search results
  searchResults.innerHTML = '';
});
