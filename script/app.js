const filterContent = document.getElementById("filterContent");
const outputContainer = document.getElementById("output-container");

filterContent.addEventListener("show.bs.collapse", () => {
  outputContainer.classList.add("shrink");
});

filterContent.addEventListener("hide.bs.collapse", () => {
  outputContainer.classList.remove("shrink");
});

//---------------------------------------------------------//

function toggleExpand(element) {
  let grid = document.getElementById("grid");
  let isExpanded = element.classList.contains("expanded");

  // Remove expanded class from all items
  document.querySelectorAll(".grid-item").forEach((item) => {
    item.classList.remove("expanded");
  });

  if (!isExpanded) {
    element.classList.add("expanded");
    grid.classList.add("dimmed"); // Apply dimming
  } else {
    grid.classList.remove("dimmed"); // Remove dimming when collapsed
  }
}

//----------------------------------------------------------SentenceGenerator
// Function to get a random item from an array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to generate multiple sentences and combine them
function generateSentenceCombination(wordsData, targetLength) {
  let currentSentence = "";
  const maxIterations = 50; // Increased iterations to ensure length
  let iterations = 0;

  while (currentSentence.length < targetLength && iterations < maxIterations) {
    // Select random words with repeated selection allowed
    const subject = getRandomItem(wordsData.Subject.Nouns);
    const verb = getRandomItem(wordsData.Predicate.Verbs);
    const helpingVerb = getRandomItem(wordsData.Predicate["Helping Verbs"]);
    const directObject = getRandomItem(wordsData.Object["Direct Objects"]);
    const subjectComplement = getRandomItem(
      wordsData.Complement["Subject Complements"]
    );
    const objectComplement = getRandomItem(
      wordsData.Complement["Object Complements"]
    );
    const article = getRandomItem(wordsData.Modifiers.Articles);
    const adjective = getRandomItem(wordsData.Modifiers.Adjectives);

    // Expanded sentence templates with more variety
    const sentenceTemplates = [
      `${subject} ${helpingVerb} ${subjectComplement}. `,
      `${subject} ${verb} ${article} ${adjective} ${directObject}. `,
      `${subject} ${verb} ${directObject} that ${helpingVerb} ${objectComplement}. `,
      `The ${adjective} ${subject} ${verb} ${article} ${directObject}. `,
      `Despite challenges, ${subject} ${helpingVerb} determined to ${verb} ${directObject}. `,
      `With great enthusiasm, ${subject} ${verb} ${article} ${adjective} ${directObject} remarkably well. `
    ];

    // Add a new sentence if adding it won't exceed the target length
    const newSentence = getRandomItem(sentenceTemplates);
    if ((currentSentence + newSentence).length <= targetLength) {
      currentSentence += newSentence;
    }

    iterations++;
  }

  return currentSentence.trim();
}

// Function to generate a random sentence with specific length
function generateRandomSentence(wordsData, lengthFilter) {
  // Define length ranges
  const lengthRanges = {
    small: { min: 0, max: 200 },
    medium: { min: 201, max: 400 },
    large: { min: 401, max: 500 },
  };

  // If no filter is selected, generate a default sentence
  if (!lengthFilter) {
    const templates = [
      `The ${getRandomItem(wordsData.Modifiers.Adjectives)} ${getRandomItem(
        wordsData.Subject.Nouns
      )} ${getRandomItem(wordsData.Predicate.Verbs)} ${getRandomItem(
        wordsData.Object["Direct Objects"]
      )}.`,
    ];
    return getRandomItem(templates);
  }

  // Get the target length range
  const range = lengthRanges[lengthFilter];

  // Generate sentences until we find one in the right length range
  const sentence = generateSentenceCombination(wordsData, range.max);

  // Verify the sentence meets the length criteria
  if (sentence.length >= range.min && sentence.length <= range.max) {
    return sentence;
  }

  // Fallback if no suitable sentence is found
  return `Unable to generate a ${lengthFilter} sentence.`;
}

// Function to update the output container
function updateOutputContainer() {
  // Determine selected length filter
  let selectedLength = null;
  const smallCheckbox = document.getElementById("small-sentence");
  const mediumCheckbox = document.getElementById("medium-sentence");
  const largeCheckbox = document.getElementById("large-sentence");

  if (smallCheckbox.checked) selectedLength = "small";
  else if (mediumCheckbox.checked) selectedLength = "medium";
  else if (largeCheckbox.checked) selectedLength = "large";

  // Fetch the words data
  fetch("json/words.json")
    .then((response) => response.json())
    .then((wordsData) => {
      // Generate a random sentence with selected length
      const randomSentence = generateRandomSentence(wordsData, selectedLength);

      // Update the output container
      const outputContainer = document.getElementById("output-container");
      outputContainer.querySelector(".card-text").textContent = randomSentence;

      // Display sentence length for verification
      const sentenceLength = randomSentence.length;
      outputContainer.querySelector(
        ".card-text"
      ).innerHTML += `<br><small class="text-muted">(Length: ${sentenceLength} characters)</small>`;
    })
    .catch((error) => {
      console.error("Error fetching words data:", error);
      const outputContainer = document.getElementById("output-container");
      outputContainer.querySelector(".card-text").textContent =
        "Error generating sentence";
    });
}

// Add event listeners to buttons and checkboxes
document.addEventListener("DOMContentLoaded", () => {
  // Generate button event listener
  const generateButton = document.getElementById("generate-btn");
  generateButton.addEventListener("click", updateOutputContainer);

  // Add event listeners to length checkboxes
  const lengthCheckboxes = [
    document.getElementById("small-sentence"),
    document.getElementById("medium-sentence"),
    document.getElementById("large-sentence"),
  ];

  lengthCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // Uncheck other checkboxes
      lengthCheckboxes.forEach((cb) => {
        if (cb !== this) cb.checked = false;
      });

      // Generate a new sentence when checkbox is changed
      updateOutputContainer();
    });
  });

  // Generate initial sentence on page load
  updateOutputContainer();
});

