const filterContent = document.getElementById("filterContent");
const outputContainer = document.getElementById("output-container");

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
    // Additional word lists for missing placeholders
    const possessivePronounList = ["his", "her", "their", "its"];
    const personalPronounList = ["he", "she", "they", "it"];
    const adverbList = [
      "quickly",
      "carefully",
      "enthusiastically",
      "silently",
      "boldly",
    ];

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

    // Add new random selections for missing placeholders
    const possessivePronoun = getRandomItem(possessivePronounList);
    const personalPronoun = getRandomItem(personalPronounList);
    const adverb = getRandomItem(adverbList);

    // Expanded sentence templates with more variety
    const sentenceTemplates = [
      `${subject} ${helpingVerb} feeling ${adjective} about ${possessivePronoun} progress.`,
      `${subject} ${verb} ${article} ${adjective} ${directObject} and felt accomplished.`,
      `${subject} ${helpingVerb} always striving to ${verb} better each day.`,
      `${subject} ${verb} ${directObject} with great enthusiasm and determination.`,
      `The ${adjective} ${subject} ${verb} through the challenges with ease.`,
      `Despite the obstacles, ${subject} ${helpingVerb} determined to ${verb} ${directObject}.`,
      `With a deep breath, ${subject} ${verb} ${directObject} and moved forward.`,
      `${subject} ${verb} ${directObject} without hesitation, knowing it was the right choice.`,
      `No matter the situation, ${subject} ${helpingVerb} ready to ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} while thinking about the future.`,
      `In the face of adversity, ${subject} ${helpingVerb} remained strong.`,
      `${subject} ${verb} ${directObject} with a smile, enjoying the moment.`,
      `The ${adjective} ${subject} ${verb} ${article} ${directObject} with care and precision.`,
      `${subject} ${verb} ${directObject} effortlessly, impressing everyone around.`,
      `${subject} ${helpingVerb} always looking for ways to ${verb} ${directObject} better.`,
      `Even when tired, ${subject} ${helpingVerb} pushed forward and ${verb} ${directObject}.`,
      `After much thought, ${subject} ${verb} ${directObject} with confidence.`,
      `By working together, ${subject} ${helpingVerb} able to ${verb} ${directObject}.`,
      `Though uncertain, ${subject} ${helpingVerb} took the leap and ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} with a sense of accomplishment.`,
      `To make a difference, ${subject} ${helpingVerb} committed to ${verb} ${directObject}.`,
      `${subject} ${helpingVerb} inspired to ${verb} ${directObject} after hearing the story.`,
      `The journey was tough, but ${subject} ${helpingVerb} kept moving forward.`,
      `In a quiet moment, ${subject} ${helpingVerb} reflected on ${possessivePronoun} choices.`,
      `${subject} ${verb} ${directObject} because it felt like the right thing to do.`,
      `With a sense of purpose, ${subject} ${verb} ${directObject} wholeheartedly.`,
      `At the last minute, ${subject} ${helpingVerb} decided to ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} as if ${possessivePronoun} life depended on it.`,
      `Although nervous, ${subject} ${helpingVerb} stepped up to ${verb} ${directObject}.`,
      `While the world watched, ${subject} ${verb} ${directObject} with grace.`,
      `The sun was setting when ${subject} finally ${verb} ${directObject}.`,
      `Despite doubts, ${subject} ${helpingVerb} believed in the power of ${possessivePronoun} actions.`,
      `The moment felt surreal as ${subject} ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} with a newfound sense of purpose.`,
      `Even in chaos, ${subject} ${helpingVerb} found a way to ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} and felt a weight lift off ${possessivePronoun} shoulders.`,
      `As the crowd cheered, ${subject} ${verb} ${directObject} with excitement.`,
      `No matter the odds, ${subject} ${helpingVerb} determined to ${verb} ${directObject}.`,
      `In a surprising twist, ${subject} ${verb} ${directObject} unexpectedly.`,
      `${subject} ${verb} ${directObject} because it was the right thing to do.`,
      `Against all expectations, ${subject} ${helpingVerb} found the courage to ${verb} ${directObject}.`,
      `The world seemed to pause as ${subject} ${verb} ${directObject}.`,
      `It took time, but ${subject} ${helpingVerb} finally ready to ${verb} ${directObject}.`,
      `After a long journey, ${subject} ${helpingVerb} proud of ${possessivePronoun} progress.`,
      `As the stars shone above, ${subject} ${verb} ${directObject} and smiled.`,
      `${subject} ${verb} ${directObject} with an energy that was contagious.`,
      `Knowing it was time, ${subject} ${helpingVerb} made the bold choice to ${verb} ${directObject}.`,
      `The challenge was tough, but ${subject} ${helpingVerb} determined to overcome it.`,
      `${subject} ${verb} ${directObject} and felt a surge of confidence.`,
      `The journey was unpredictable, but ${subject} ${helpingVerb} adapted and grew.`,
      `${subject} ${helpingVerb} excited to see where ${possessivePronoun} path would lead.`,
      `Despite initial fears, ${subject} ${helpingVerb} embraced the opportunity to ${verb} ${directObject}.`,
      `The air was filled with anticipation as ${subject} ${verb} ${directObject}.`,
      `As the morning light broke, ${subject} ${helpingVerb} prepared to ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} with a deep sense of gratitude.`,
      `Each step forward made ${subject} ${helpingVerb} more certain of ${possessivePronoun} decision.`,
      `With a heart full of hope, ${subject} ${verb} ${directObject}.`,
      `Although the road was uncertain, ${subject} ${helpingVerb} determined to continue.`,
      `At that moment, ${subject} ${helpingVerb} felt truly alive.`,
      `While reflecting on the past, ${subject} ${verb} ${directObject} with newfound wisdom.`,
      `${subject} ${verb} ${directObject} and discovered something unexpected.`,
      `Taking a deep breath, ${subject} ${helpingVerb} moved forward with determination.`,
      `Through all the ups and downs, ${subject} ${helpingVerb} never lost sight of ${possessivePronoun} goal.`,
      `${subject} ${verb} ${directObject} in a way that left an impact.`,
      `Though exhausted, ${subject} ${helpingVerb} found the strength to ${verb} ${directObject}.`,
      `The path was uncertain, but ${subject} ${helpingVerb} willing to take the risk.`,
      `No one expected it, but ${subject} ${helpingVerb} managed to ${verb} ${directObject}.`,
      `${subject} ${verb} ${directObject} and learned a valuable lesson along the way.`,
      `The experience taught ${subject} that every step matters.`,
      `The journey was long, but ${subject} ${helpingVerb} grateful for every moment.`,
      `Every decision led ${subject} closer to ${possessivePronoun} dream.`,
      `Even in the darkest moments, ${subject} ${helpingVerb} held onto hope.`,
      `With newfound clarity, ${subject} ${verb} ${directObject} and embraced the future.`,
      `${subject} ${verb} ${directObject} in a way that changed everything.`,
      `Despite uncertainty, ${subject} ${helpingVerb} took the chance to ${verb} ${directObject}.`,
      `A single choice made all the difference as ${subject} ${verb} ${directObject}.`,
      `${subject} ${helpingVerb} embraced the challenge and grew from it.`,
      `The best moments come when ${subject} ${verb} ${directObject} fearlessly.`,
      `With a heart full of passion, ${subject} ${verb} ${directObject} and inspired others.`,
      `No matter the odds, ${subject} ${helpingVerb} always willing to try.`,
      `Looking back, ${subject} ${helpingVerb} proud of every step taken.`,
      `The story of ${subject} is one of courage, perseverance, and triumph.`,
      `As the sun set, ${subject} ${verb} ${directObject} and felt at peace.`,
    ];

    // Add a new sentence if adding it won't exceed the target length
    const newSentence = getRandomItem(sentenceTemplates);
    if ((currentSentence + " " + newSentence).length <= targetLength) {
      if (currentSentence.length > 0) {
        currentSentence += " " + newSentence;
      } else {
        currentSentence = newSentence;
      }
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
  fetch("./json/words.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((wordsData) => {
      // Generate a random sentence with selected length
      const randomSentence = generateRandomSentence(wordsData, selectedLength);

      // Update the output container
      const outputContainer = document.getElementById("output-container");
      const cardText = outputContainer.querySelector(".card-text");
      if (cardText) {
        cardText.innerHTML =
          randomSentence +
          `<br><small class="text-muted">(Length: ${randomSentence.length} characters)</small>`;
      } else {
        console.error("Card text element not found in output container");
      }
    })
    .catch((error) => {
      console.error("Error fetching words data:", error);
      const outputContainer = document.getElementById("output-container");
      const cardText = outputContainer.querySelector(".card-text");
      if (cardText) {
        cardText.textContent =
          "Error generating sentence. Check console for details.";
      }
    });
}

// Add filter toggle event listeners
if (filterContent) {
  filterContent.addEventListener("show.bs.collapse", () => {
    if (outputContainer) {
      outputContainer.classList.add("shrink");
    }
  });

  filterContent.addEventListener("hide.bs.collapse", () => {
    if (outputContainer) {
      outputContainer.classList.remove("shrink");
    }
  });
}

// Add event listeners to buttons and checkboxes
document.addEventListener("DOMContentLoaded", () => {
  // Generate button event listener
  const generateButton = document.getElementById("generate-btn");
  if (generateButton) {
    generateButton.addEventListener("click", updateOutputContainer);
  }

  // Add event listeners to length checkboxes
  const lengthCheckboxes = [
    document.getElementById("small-sentence"),
    document.getElementById("medium-sentence"),
    document.getElementById("large-sentence"),
  ];

  lengthCheckboxes.forEach((checkbox) => {
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        // Uncheck other checkboxes
        lengthCheckboxes.forEach((cb) => {
          if (cb && cb !== this) cb.checked = false;
        });

        // Generate a new sentence when checkbox is changed
        updateOutputContainer();
      });
    }
  });

  // Save button event listener
  const saveButton = document.getElementById("save-btn");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      const outputText = document.querySelector(".card-text").textContent;
      // Here you would add code to save the sentence to your history
      console.log("Saved sentence:", outputText);
      alert("Sentence saved to history!");
    });
  }

  // Reset button event listener
  const resetButton = document.getElementById("reset-btn");
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      // Uncheck all checkboxes
      lengthCheckboxes.forEach((cb) => {
        if (cb) cb.checked = false;
      });

      // Clear the output or generate a default sentence
      updateOutputContainer();
      console.log("Reset filters and output");
    });
  }

  // Generate initial sentence on page load
  updateOutputContainer();
});

// History grid item expand functionality
function toggleExpand(element) {
  // Remove expanded class from all grid items
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (item !== element) {
      item.classList.remove("expanded");
      item.style.opacity = "1";
      item.style.visibility = "visible";
    }
  });

  // Toggle the expanded class on the clicked item
  element.classList.toggle("expanded");

  // If expanded, dim other items
  if (element.classList.contains("expanded")) {
    gridItems.forEach((item) => {
      if (item !== element) {
        item.style.opacity = "0.3";
        item.style.visibility = "visible";
      }
    });
  } else {
    // If not expanded, reset all items
    gridItems.forEach((item) => {
      item.style.opacity = "1";
      item.style.visibility = "visible";
    });
  }
}

// Close expanded items when clicking outside
document.addEventListener("click", function (event) {
  const grid = document.getElementById("grid");
  if (grid && !grid.contains(event.target)) {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item) => {
      item.classList.remove("expanded");
      item.style.opacity = "1";
      item.style.visibility = "visible";
    });
  }
});

// Prevent event propagation on grid items to avoid immediate closing
document.querySelectorAll(".grid-item").forEach((item) => {
  item.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});

//history tab animations and interactions
filterContent.addEventListener("hide.bs.collapse", () => {
  outputContainer.classList.remove("shrink");
});

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




