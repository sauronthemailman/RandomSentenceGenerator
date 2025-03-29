  // --------------------------
  // Dictionary Logic
  // --------------------------
  const dictionaryElements = {
    searchInput: document.getElementById("search-input"),
    autocompleteContainer: document.getElementById("autocomplete-container"),
    searchBtn: document.getElementById("search-btn"),
    addBtn: document.getElementById("add-btn"),
    deleteBtn: document.getElementById("delete-btn"),
    wordInput: document.getElementById("word-input"),
    categorySelect: document.getElementById("category-select"),
    confirmAddWord: document.getElementById("confirm-add-word"),
    addWordModal: document.getElementById("addWordModal"),
    resultsContainer: document.getElementById("results"),
  };

  // Only initialize dictionary if elements exist
  if (dictionaryElements.searchInput && dictionaryElements.addBtn) {
    let wordsData = {};

    async function loadWords() {
      try {
        const response = await fetch("json/words.json");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        wordsData = await response.json();
        console.log("Words data loaded successfully");
      } catch (error) {
        console.error("Error loading words data:", error);
        throw error;
      }
    }

    function setupEventListeners() {
      dictionaryElements.searchInput.addEventListener(
        "input",
        handleSearchInput
      );
      dictionaryElements.searchBtn.addEventListener("click", handleSearch);
      dictionaryElements.addBtn.addEventListener("click", () => {
        new bootstrap.Modal(dictionaryElements.addWordModal).show();
      });
      dictionaryElements.deleteBtn.addEventListener("click", handleDeleteWord);
      dictionaryElements.confirmAddWord.addEventListener(
        "click",
        handleAddWord
      );

      dictionaryElements.autocompleteContainer?.addEventListener(
        "click",
        (e) => {
          if (e.target.classList.contains("autocomplete-item")) {
            dictionaryElements.searchInput.value = e.target.textContent;
            dictionaryElements.autocompleteContainer.classList.add("d-none");
          }
        }
      );
    }

    function handleSearchInput(e) {
      const query = e.target.value.trim();
      showAutocompleteMatches(query);
    }

    function handleSearch() {
      const query = dictionaryElements.searchInput.value.trim();
      if (!query) {
        alert("Please enter a search term");
        return;
      }
      console.log("Searching for:", query);
    }

    function showAutocompleteMatches(query) {
      if (query.length < 2) {
        dictionaryElements.autocompleteContainer?.classList.add("d-none");
        return;
      }

      const matches = getAllWords().filter((word) =>
        word.toLowerCase().includes(query.toLowerCase())
      );

      if (!matches.length || !dictionaryElements.autocompleteContainer) {
        dictionaryElements.autocompleteContainer?.classList.add("d-none");
        return;
      }

      dictionaryElements.autocompleteContainer.innerHTML = matches
        .slice(0,)
        .map((word) => `<div class="autocomplete-item">${word}</div>`)
        .join("");

      dictionaryElements.autocompleteContainer.classList.remove("d-none");
    }

    function getAllWords() {
      return Object.values(wordsData).flatMap((group) =>
        Object.values(group).flat()
      );
    }

    function handleAddWord() {
      const word = dictionaryElements.wordInput?.value.trim();
      const category = dictionaryElements.categorySelect?.value;

      if (!validateWordInput(word, category)) return;

      const groupName = getGroupForCategory(category);
      if (!groupName) {
        alert("Invalid category selected");
        return;
      }

      if (addWordToData(word, groupName, category)) {
        const modal = bootstrap.Modal.getInstance(
          dictionaryElements.addWordModal
        );
        modal?.hide();
        clearAddWordForm();
        alert(`Successfully added "${word}" to ${category}`);
      }
    }

    function validateWordInput(word, category) {
      if (!word) {
        alert("Please enter a word");
        return false;
      }
      if (!category) {
        alert("Please select a category");
        return false;
      }
      return true;
    }

    function getGroupForCategory(category) {
      const categoryGroups = {
        Subject: ["Nouns", "Pronouns"],
        Predicate: ["Verbs", "Helping Verbs"],
        Object: ["Direct Objects", "Indirect Objects"],
        Complement: ["Subject Complements", "Object Complements"],
        Modifiers: [
          "Articles",
          "Demonstratives",
          "Possessives",
          "Quantifiers",
          "Adjectives",
        ],
      };

      for (const [group, categories] of Object.entries(categoryGroups)) {
        if (categories.includes(category)) return group;
      }
      return null;
    }

    function addWordToData(word, groupName, category) {
      if (!wordsData[groupName]) wordsData[groupName] = {};
      if (!wordsData[groupName][category]) wordsData[groupName][category] = [];

      if (wordsData[groupName][category].includes(word)) {
        alert(`"${word}" already exists in ${category}`);
        return false;
      }

      wordsData[groupName][category].push(word);
      console.log(`Added "${word}" to ${groupName} > ${category}`);
      return true;
    }

    function handleDeleteWord() {
      const word = dictionaryElements.searchInput?.value.trim();
      if (!word) {
        alert("Please enter a word to delete");
        return;
      }

      if (deleteWordFromData(word)) {
        dictionaryElements.searchInput.value = "";
        dictionaryElements.autocompleteContainer?.classList.add("d-none");
        alert(`Deleted "${word}"`);
      } else {
        alert("Word not found");
      }
    }

    function deleteWordFromData(word) {
      let deleted = false;
      for (const [group, categories] of Object.entries(wordsData)) {
        for (const [category, words] of Object.entries(categories)) {
          const index = words.indexOf(word);
          if (index !== -1) {
            words.splice(index, 1);
            console.log(`Deleted "${word}" from ${group} > ${category}`);
            deleted = true;
          }
        }
      }
      return deleted;
    }

    function clearAddWordForm() {
      if (dictionaryElements.wordInput) dictionaryElements.wordInput.value = "";
      if (dictionaryElements.categorySelect)
        dictionaryElements.categorySelect.value = "";
    }

    // Initialize dictionary
    loadWords()
      .then(() => setupEventListeners())
      .catch(console.error);
  }

  // --------------------------
  // History Grid Logic
  // --------------------------
  function toggleExpand(element) {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item) => {
      if (item !== element) {
        item.classList.remove("expanded");
        item.style.opacity = "1";
        item.style.visibility = "visible";
      }
    });

    element.classList.toggle("expanded");

    if (element.classList.contains("expanded")) {
      gridItems.forEach((item) => {
        if (item !== element) {
          item.style.opacity = "0.3";
          item.style.visibility = "visible";
        }
      });
    } else {
      gridItems.forEach((item) => {
        item.style.opacity = "1";
        item.style.visibility = "visible";
      });
    }
  }

  document.addEventListener("click", function (event) {
    const grid = document.getElementById("grid");
    const gridItems = document.querySelectorAll(".grid-item");

    if (grid && !grid.contains(event.target)) {
      gridItems.forEach((item) => {
        item.classList.remove("expanded");
        item.style.opacity = "1";
        item.style.visibility = "visible";
      });
    }
  });

  document.querySelectorAll(".grid-item")?.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleExpand(this);
    });
  });

