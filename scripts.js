const modal = document.getElementById("myModal");
const closeModalBtn = document.querySelector(".close");
const pokePickerInput = document.getElementById("poke-picker");
const suggestionsList = document.getElementById("suggestions-list");

let keywords = [];
let currentIndex = -1; // This will track the currently selected suggestion
let selectedKeyword = null; // This will track the selected keyword (either typed or clicked)
let id = -1;
let categories = [];
let numbersLeft = [1, 2, 3, 4, 5, 6, 7, 8, 9];
fetch("keywords.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate the keywords array from the JSON file
    keywords = data["keywords"];
  })
  .catch((error) => console.error("Error loading the JSON file:", error));
fetch("categoryList.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate the keywords array from the JSON file
    categoryList = data["categoryList"];
  })
  .catch((error) => console.error("Error loading the JSON file:", error));
fetch("pokemonData.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate the keywords array from the JSON file
    pokemonData = data;
  })
  .catch((error) => console.error("Error loading the JSON file:", error));
fetch("dictoflists.json")
  .then((response) => response.json())
  .then((data) => {
    // Populate the keywords array from the JSON file
    dictoflists = data;
    categories = generateCategories();
    setCategories();
  })
  .catch((error) => console.error("Error loading the JSON file:", error));

function openPicker(identificationNumber) {
  idNum = identificationNumber.slice(-1);
  id = parseInt(idNum);
  modal.style.display = "flex";
  pokePickerInput.focus();
  suggestionsList.innerHTML = "";
  pokePickerInput.value = "";
  document.getElementById("modal-header").innerHTML =
    "Categories: " +
    categoryList[getCategory(id)[0]] +
    " + " +
    categoryList[getCategory(id)[1]];
}

document.addEventListener("keydown", function (event) {
  // Check if the key pressed is a number key (0-9)
  console.log(numbersLeft);
  if (numbersLeft.includes(parseInt(event.key))) {
    event.preventDefault();
    openPicker(event.key);
  }
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Hide the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

pokePickerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Prevent form submission or other default behavior
    event.preventDefault();

    // If a suggestion is selected, submit it
    if (
      currentIndex >= 0 &&
      currentIndex < suggestionsList.getElementsByTagName("li").length
    ) {
      const selectedItem =
        suggestionsList.getElementsByTagName("li")[currentIndex];
      selectKeyword(selectedItem.textContent);
    } else {
      // Submit the typed value or the selected keyword
      submitPokemon();
    }
  } else if (event.key === "Escape") {
    modal.style.display = "none";
  }
});

pokePickerInput.addEventListener("input", filterKeywords);
pokePickerInput.addEventListener("keydown", navigateSuggestions);

function filterKeywords() {
  const query = pokePickerInput.value.trim().toLowerCase();
  currentIndex = -1;
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (query.length >= 3) {
    // Only filter after 3 or more characters are typed
    const filteredKeywords = keywords.filter((keyword) =>
      keyword.toLowerCase().includes(query)
    );

    filteredKeywords.forEach((keyword) => {
      const li = document.createElement("li");

      // Create image element for the suggestion
      const img = document.createElement("img");
      img.src = `images/pokemon/${keyword.toUpperCase()}.png`; // Adjust the path as needed
      img.alt = keyword; // Set alt text as the keyword for accessibility
      img.classList.add("suggestion-image"); // Optional: for styling

      // Create text node for the suggestion
      const text = document.createTextNode(keyword);

      // Append both the image and the text to the list item
      li.appendChild(img);
      li.appendChild(text);

      // Add click event to select the suggestion
      li.onclick = () => selectKeyword(keyword);

      suggestionsList.appendChild(li);
    });
  }
}

function navigateSuggestions(event) {
  const items = suggestionsList.getElementsByTagName("li");

  if (event.key === "ArrowDown") {
    // Move down
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateSelectedItem(items);
    }
  } else if (event.key === "ArrowUp") {
    // Move up
    if (currentIndex > 0) {
      currentIndex--;
      updateSelectedItem(items);
    }
  }
}

function updateSelectedItem(items) {
  // Remove 'selected' class from all items
  Array.from(items).forEach((item) => item.classList.remove("selected"));

  // Add 'selected' class to the current item
  if (currentIndex >= 0 && currentIndex < items.length) {
    items[currentIndex].classList.add("selected");
  }
}

function selectKeyword(keyword) {
  pokePickerInput.value = keyword;
  suggestionsList.innerHTML = ""; // Clear suggestions after selection
  selectedKeyword = keyword; // Set the selected keyword
  currentIndex = -1; // Reset the currentIndex after selection
  pokePickerInput.focus();
}
function getCategory(id) {
  category = [];
  category.push(categories[(id - 1) % 3]);
  category.push(categories[Math.floor((id - 1) / 3) + 3]);
  return category;
}
function verify(mon, category) {
  pokemon = pokemonData[mon];
  one = category[0];
  if (categoryList.indexOf(one) == 0 && pokemon[2] != 0) return false;
  if (
    categoryList.indexOf(one) < 19 &&
    !(
      pokemon[1] == categoryList.indexOf(one) ||
      pokemon[2] == categoryList.indexOf(one)
    )
  )
    return false;
  if (
    categoryList.indexOf(one) > 18 &&
    categoryList.indexOf(one) < 23 &&
    categoryList.indexOf(one) - 18 != pokemon[3]
  )
    return false;
  if (categoryList.indexOf(one) == 23 && pokemon[2] == 0) return false;
  if (
    categoryList.indexOf(one) > 23 &&
    categoryList.indexOf(one) < 28 &&
    categoryList.indexOf(one) - 24 != pokemon[6]
  )
    return false;
  if (
    categoryList.indexOf(one) > 27 &&
    categoryList.indexOf(one) < 38 &&
    categoryList.indexOf(one) - 27 != pokemon[7]
  )
    return false;
  if (categoryList.indexOf(one) == 38 && pokemon[8] > 1) return false;
  if (categoryList.indexOf(one) == 39 && (pokemon[8] == 1 || pokemon[8] >= 20))
    return false;
  if (categoryList.indexOf(one) == 40 && (pokemon[8] < 20 || pokemon[8] > 30))
    return false;
  if (categoryList.indexOf(one) == 41 && pokemon[8] <= 30) return false;
  if (
    categoryList.indexOf(one) < 51 &&
    categoryList.indexOf(one) > 41 &&
    categoryList.indexOf(one) - 41 != pokemon[0]
  )
    return false;
  if (
    categoryList.indexOf(one) > 50 &&
    categoryList.indexOf(one) < 970 &&
    !pokemon[9].includes(categoryList.indexOf(one) - 50)
  )
    return false;
  if (
    categoryList.indexOf(one) > 969 &&
    categoryList.indexOf(one) < 983 &&
    pokemon[10] != categoryList.indexOf(one) - 969
  )
    return false;
  if (
    categoryList.indexOf(one) > 982 &&
    categoryList.indexOf(one) < 1290 &&
    !pokemon[11].includes(categoryList.indexOf(one) - 982)
  )
    return false;
  if (
    categoryList.indexOf(one) > 1289 &&
    categoryList.indexOf(one) < 1305 &&
    !pokemon[12].includes(categoryList.indexOf(one) - 1289)
  )
    return false;
  if (
    categoryList.indexOf(one) > 1304 &&
    categoryList.indexOf(one) < 1310 &&
    pokemon[13] != categoryList.indexOf(one) - 1305
  )
    return false;
  if (
    categoryList.indexOf(one) > 1309 &&
    categoryList.indexOf(one) < 1316 &&
    pokemon[14] != categoryList.indexOf(one) - 1309
  )
    return false;
  if (
    categoryList.indexOf(one) > 1315 &&
    pokemon[15] != categoryList.indexOf(one) - 1315
  )
    return false;

  one = category[1];
  if (categoryList.indexOf(one) == 0 && pokemon[2] != 0) return false;
  if (
    categoryList.indexOf(one) < 19 &&
    !(
      pokemon[1] == categoryList.indexOf(one) ||
      pokemon[2] == categoryList.indexOf(one)
    )
  )
    return false;
  if (
    categoryList.indexOf(one) > 18 &&
    categoryList.indexOf(one) < 23 &&
    categoryList.indexOf(one) - 18 != pokemon[3]
  )
    return false;
  if (categoryList.indexOf(one) == 23 && pokemon[2] == 0) return false;
  if (
    categoryList.indexOf(one) > 23 &&
    categoryList.indexOf(one) < 28 &&
    categoryList.indexOf(one) - 24 != pokemon[6]
  )
    return false;
  if (
    categoryList.indexOf(one) > 27 &&
    categoryList.indexOf(one) < 38 &&
    categoryList.indexOf(one) - 27 != pokemon[7]
  )
    return false;
  if (categoryList.indexOf(one) == 38 && pokemon[8] > 1) return false;
  if (categoryList.indexOf(one) == 39 && (pokemon[8] == 1 || pokemon[8] >= 20))
    return false;
  if (categoryList.indexOf(one) == 40 && (pokemon[8] < 20 || pokemon[8] > 30))
    return false;
  if (categoryList.indexOf(one) == 41 && pokemon[8] <= 30) return false;
  if (
    categoryList.indexOf(one) < 51 &&
    categoryList.indexOf(one) > 41 &&
    categoryList.indexOf(one) - 41 != pokemon[0]
  )
    return false;
  if (
    categoryList.indexOf(one) > 50 &&
    categoryList.indexOf(one) < 970 &&
    !pokemon[9].includes(categoryList.indexOf(one) - 50)
  )
    return false;
  if (
    categoryList.indexOf(one) > 969 &&
    categoryList.indexOf(one) < 983 &&
    pokemon[10] != categoryList.indexOf(one) - 969
  )
    return false;
  if (
    categoryList.indexOf(one) > 982 &&
    categoryList.indexOf(one) < 1290 &&
    !pokemon[11].includes(categoryList.indexOf(one) - 982)
  )
    return false;
  if (
    categoryList.indexOf(one) > 1289 &&
    categoryList.indexOf(one) < 1305 &&
    !pokemon[12].includes(categoryList.indexOf(one) - 1289)
  )
    return false;
  if (
    categoryList.indexOf(one) > 1304 &&
    categoryList.indexOf(one) < 1310 &&
    pokemon[13] != categoryList.indexOf(one) - 1305
  )
    return false;
  if (
    categoryList.indexOf(one) > 1309 &&
    categoryList.indexOf(one) < 1316 &&
    pokemon[14] != categoryList.indexOf(one) - 1309
  )
    return false;
  if (
    categoryList.indexOf(one) > 1315 &&
    pokemon[15] != categoryList.indexOf(one) - 1315
  )
    return false;

  return true;
}
function findCommonNumbers(arr1, arr2, arr3) {
  // Get elements from the 2nd index onwards
  const filteredArr1 = arr1.slice(2);
  const filteredArr2 = arr2.slice(2);
  const filteredArr3 = arr3.slice(2);

  // Create a Set from the first array's filtered elements for quick lookup
  const set1 = new Set(filteredArr1);

  // Find common elements in arr2 and arr3 with the Set
  const commonWithArr2 = filteredArr2.filter((num) => set1.has(num));
  const set2 = new Set(commonWithArr2);

  // Find common elements in arr3 with the Set of common elements from arr2
  const commonWithArr3 = filteredArr3.filter((num) => set2.has(num));

  return commonWithArr3;
}
function generateCategories() {
  while (true) {
    let firstCategory =
      Object.keys(dictoflists)[
        Math.floor(Math.random() * Object.keys(dictoflists).length)
      ]; // Primary Index
    listCategory = dictoflists[firstCategory];
    nextThree = [];
    if (listCategory.length < 3) continue;
    for (let x = 0; x < 3; x++) {
      // Gen the 3 Oppos
      mrGuy = Math.floor(Math.random() * listCategory.length);
      if (dictoflists[listCategory[mrGuy]].length < 3) {
        x--;
        continue;
      }
      nextThree.push(listCategory[mrGuy]);
      listCategory.splice(mrGuy, 1);
    }
    const arr1 = dictoflists[nextThree[0]];
    const arr2 = dictoflists[nextThree[1]];
    const arr3 = dictoflists[nextThree[2]];
    yipperskis = findCommonNumbers(arr1, arr2, arr3);
    //console.log(yipperskis);
    if (yipperskis.length < 2) continue;
    category = [];
    category.push(parseInt(firstCategory));
    //console.log(category);
    //console.log("First Category: " + categoryList[firstCategory]);
    /*console.log(
      "Next Three: " +
        categoryList[nextThree[0]] +
        "," +
        categoryList[nextThree[1]] +
        "," +
        categoryList[nextThree[2]]
    );*/
    //console.log(yipperskis);
    for (let x = 0; x < 2; x++) {
      // Gen the remaining 2
      mrGuy = Math.floor(Math.random() * yipperskis.length);
      //console.log(mrGuy);
      category.push(yipperskis[mrGuy]);
      //console.log("PREV " + yipperskis)
      yipperskis.splice(mrGuy, 1);
      //console.log(yipperskis)
    }
    /*console.log(
      "Other Two: " +
        categoryList[category[1]] +
        "," +
        categoryList[category[2]]
    );*/
    category.push(nextThree[0]);
    category.push(nextThree[1]);
    category.push(nextThree[2]);
    if (new Set(category).size !== category.length) {
      continue;
    }
    //console.log(category);
    if (category.some((element) => element === undefined)) alert("UNDEFINED");
    return category;
  }
}

function setCategories() {
  //console.log(categoryList[categories[0]]);
  document.getElementById("l1").innerHTML = categoryList[categories[0]];
  document.getElementById("l2").innerHTML = categoryList[categories[1]];
  document.getElementById("l3").innerHTML = categoryList[categories[2]];
  document.getElementById("l4").innerHTML = categoryList[categories[3]];
  document.getElementById("l5").innerHTML = categoryList[categories[4]];
  document.getElementById("l6").innerHTML = categoryList[categories[5]];
}
function calculatePercent(pokemon, category) {
  let monList = [];
  for (let i = 0; i < keywords.length; i++) {
    if (verify(keywords[i], category)) {
      monList.push(keywords[i]);
    }
  }

  let maxWeight = pokemonData[pokemon][4];
  let maxMon = pokemon;
  for (let i = 0; i < monList.length; i++) {
    if (pokemonData[monList[i]][4] > maxWeight) {
      maxMon = monList[i];
      maxWeight = pokemonData[monList[i]][4];
    }
  }
  let quotient = (pokemonData[pokemon][4] / maxWeight) * 100;
  return [`${quotient.toFixed(1)}%`, maxMon];
}
function submitPokemon() {
  let mon = selectedKeyword || pokePickerInput.value.trim();
  const pokemon = mon.toUpperCase();
  console.log("Submitted Pokémon:", pokemon);
  modal.style.display = "none"; // Close the modal after submission
  pokePickerInput.value = "";
  suggestionsList.innerHTML = "";
  selectedKeyword = null; // Reset selected keyword after submission
  category = getCategory(id);
  if (!pokemon) {
    alert("Please Enter A Pokemon!");
    return;
  }
  if (!keywords.includes(pokemon)) {
    alert(pokemon + " is not a pokemon!");
    return;
  }
  if (!verify(pokemon, category)) {
    console.log(pokemon + " " + category);
    alert(pokemon + " is NOT ADEQUATE for the aforementioned requirements!");
    return;
  }
  for (let i = 0; i < numbersLeft.length; i++) {
    if (numbersLeft[i] === id) {
      numbersLeft[i] = 0;
    }
  }
  document.getElementById(
    "b" + id
  ).style.backgroundImage = `url(images/pokemon/${pokemon.toUpperCase()}.png)`; // Adjust the path as needed
  document.getElementById("b" + id).disabled = "true";
  let [percent, optimal] = calculatePercent(pokemon, category);
  document.getElementById("bl" + id).innerHTML = percent;
  if (percent !== "100.0%") alert("Optimal: " + optimal);
}
window.onload = function () {};
