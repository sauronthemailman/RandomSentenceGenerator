// Generator View Logic
document.addEventListener("DOMContentLoaded", () => {
  const filterContent = document.getElementById("filterContent");
  const outputContainer = document.getElementById("output-container");
  const generateButton = document.getElementById("generate-btn");
  const saveButton = document.getElementById("save-btn");
  const resetButton = document.getElementById("reset-btn");
  const lengthCheckboxes = [
    document.getElementById("small-sentence"),
    document.getElementById("medium-sentence"),
    document.getElementById("large-sentence"),
  ];

  // Function to get a random item from an array
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Function to generate multiple sentences and combine them
  async function generateSentenceCombination(wordsData, targetLength) {
    let currentSentence = "";
    const maxIterations = 50;
    let iterations = 0;

    while (
      currentSentence.length < targetLength &&
      iterations < maxIterations
    ) {
      const possessivePronounList = ["his", "her", "their", "its"];
      const personalPronounList = ["he", "she", "they", "it"];
      const adverbList = [
        "quickly",
        "carefully",
        "enthusiastically",
        "silently",
        "boldly",
      ];

      // Select random words
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
      const possessivePronoun = getRandomItem(possessivePronounList);
      const personalPronoun = getRandomItem(personalPronounList);
      const adverb = getRandomItem(adverbList);

      // Sentence templates
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

      const newSentence = getRandomItem(sentenceTemplates);
      if ((currentSentence + " " + newSentence).length <= targetLength) {
        currentSentence = currentSentence
          ? currentSentence + " " + newSentence
          : newSentence;
      }
      iterations++;
    }

    return currentSentence.trim();
  }

  // Get target length based on filter
  function getTargetLength(lengthFilter) {
    const lengthRanges = {
      small: { min: 0, max: 200 },
      medium: { min: 201, max: 400 },
      large: { min: 401, max: 500 },
    };
    return lengthRanges[lengthFilter]?.max || 200;
  }

  // Get selected length filter
  function getSelectedLength() {
    if (lengthCheckboxes[0].checked) return "small";
    if (lengthCheckboxes[1].checked) return "medium";
    if (lengthCheckboxes[2].checked) return "large";
    return null;
  }

  // Generate random sentence
  async function generateRandomSentence(lengthFilter) {
    try {
      const response = await fetch("/api/words");
      const wordsData = await response.json();

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

      return generateSentenceCombination(
        wordsData,
        getTargetLength(lengthFilter)
      );
    } catch (error) {
      console.error("Error generating sentence:", error);
      return "Error generating sentence. Please try again.";
    }
  }

  // Update output container
  async function updateOutputContainer() {
    const selectedLength = getSelectedLength();
    const sentence = await generateRandomSentence(selectedLength);

    const cardText = outputContainer.querySelector(".card-text");
    if (cardText) {
      cardText.innerHTML = `${sentence}<br><small class="text-muted">(Length: ${sentence.length} characters)</small>`;
    }
  }

  // Save sentence to history
  async function saveSentence() {
    const cardText = document.querySelector(".card-text");
    const outputText = cardText
      ? cardText.textContent.split("(Length:")[0].trim()
      : "";

    if (outputText) {
      try {
        const response = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sentence: outputText }),
        });

        if (response.ok) {
          alert("Sentence saved to history!");
        } else {
          alert("Failed to save sentence.");
        }
      } catch (error) {
        console.error("Error saving sentence:", error);
        alert("Error saving sentence. Please try again.");
      }
    }
  }

  // Reset filters
  function resetFilters() {
    lengthCheckboxes.forEach((cb) => (cb.checked = false));
    updateOutputContainer();
  }

  // Filter content toggle events
  if (filterContent) {
    filterContent.addEventListener("show.bs.collapse", () => {
      outputContainer?.classList.add("shrink");
    });
    filterContent.addEventListener("hide.bs.collapse", () => {
      outputContainer?.classList.remove("shrink");
    });
  }

  // Event listeners
  if (generateButton)
    generateButton.addEventListener("click", updateOutputContainer);
  if (saveButton) saveButton.addEventListener("click", saveSentence);
  if (resetButton) resetButton.addEventListener("click", resetFilters);
  lengthCheckboxes.forEach((checkbox) => {
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        lengthCheckboxes.forEach((cb) => {
          if (cb !== this) cb.checked = false;
        });
        updateOutputContainer();
      });
    }
  });

  // Initialize
  updateOutputContainer();
});
