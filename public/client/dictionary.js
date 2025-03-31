// Dictionary View Logic
document.addEventListener("DOMContentLoaded", () => {
  const elements = {
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

  let wordsData = {};

  // Load words data
  async function loadWords() {
    try {
      const response = await fetch("/api/words");
      wordsData = await response.json();
    } catch (error) {
      console.error("Error loading words:", error);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    if (elements.searchInput) {
      elements.searchInput.addEventListener("input", handleSearchInput);
    }
    if (elements.searchBtn) {
      elements.searchBtn.addEventListener("click", handleSearch);
    }
    if (elements.addBtn) {
      elements.addBtn.addEventListener("click", () => {
        new bootstrap.Modal(elements.addWordModal).show();
      });
    }
    if (elements.deleteBtn) {
      elements.deleteBtn.addEventListener("click", handleDeleteWord);
    }
    if (elements.confirmAddWord) {
      elements.confirmAddWord.addEventListener("click", handleAddWord);
    }
    if (elements.autocompleteContainer) {
      elements.autocompleteContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("autocomplete-item")) {
          elements.searchInput.value = e.target.textContent;
          elements.autocompleteContainer.classList.add("d-none");
        }
      });
    }
  }

  // Handle search input
  function handleSearchInput(e) {
    const query = e.target.value.trim();
    showAutocompleteMatches(query);
  }

  // Handle search
  function handleSearch() {
    const query = elements.searchInput.value.trim();
    if (!query) {
      alert("Please enter a search term");
      return;
    }
    console.log("Searching for:", query);
    // Implement actual search functionality here
  }

  // Show autocomplete matches
  function showAutocompleteMatches(query) {
    if (query.length < 2) {
      elements.autocompleteContainer?.classList.add("d-none");
      return;
    }

    const matches = getAllWords().filter((word) =>
      word.toLowerCase().includes(query.toLowerCase())
    );

    if (!matches.length || !elements.autocompleteContainer) {
      elements.autocompleteContainer?.classList.add("d-none");
      return;
    }

    elements.autocompleteContainer.innerHTML = matches
      .slice(0, 5)
      .map((word) => `<div class="autocomplete-item">${word}</div>`)
      .join("");

    elements.autocompleteContainer.classList.remove("d-none");
  }

  // Get all words
  function getAllWords() {
    return Object.values(wordsData).flatMap((group) =>
      Object.values(group).flat()
    );
  }

  // Handle add word
  async function handleAddWord() {
    const word = elements.wordInput?.value.trim();
    const category = elements.categorySelect?.value;

    if (!validateWordInput(word, category)) return;

    const groupName = getGroupForCategory(category);
    if (!groupName) {
      alert("Invalid category selected");
      return;
    }

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: word,
          group: groupName,
          category: category,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Update local data if server update was successful
        addWordToData(word, groupName, category);
        const modal = bootstrap.Modal.getInstance(elements.addWordModal);
        modal?.hide();
        clearAddWordForm();
        alert(`Successfully added "${word}" to ${category}`);
      } else {
        alert(result.error || "Failed to add word");
      }
    } catch (error) {
      console.error("Error adding word:", error);
      alert("Failed to add word");
    }
  }

  // Validate word input
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

  // Get group for category
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

  // Add word to data
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

  // Handle delete word
  async function handleDeleteWord() {
    const word = elements.searchInput?.value.trim();
    if (!word) {
      alert("Please enter a word to delete");
      return;
    }

    try {
      const response = await fetch("/api/words", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      const result = await response.json();
      if (response.ok) {
        // Update local data if server update was successful
        deleteWordFromData(word);
        elements.searchInput.value = "";
        elements.autocompleteContainer?.classList.add("d-none");
        alert(`Deleted "${word}"`);
      } else {
        alert(result.error || "Word not found");
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      alert("Failed to delete word");
    }
  }

  // Delete word from data
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

  // Clear add word form
  function clearAddWordForm() {
    if (elements.wordInput) elements.wordInput.value = "";
    if (elements.categorySelect) elements.categorySelect.value = "";
  }

  // Initialize
  loadWords().then(() => setupEventListeners());
});
