// History View Logic
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");

  // Load and display history
  async function loadHistoryView() {
    try {
      const response = await fetch("/api/history");
      const historyData = await response.json();
      updateHistoryGrid(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
      // Fallback to localStorage
      const historyData = JSON.parse(
        localStorage.getItem("sentenceHistory") || "[]"
      );
      updateHistoryGrid(historyData);
    }
  }

  // Update grid with history data
  function updateHistoryGrid(sentences) {
    if (!grid) return;

    grid.innerHTML = sentences
      .slice(0, 8)
      .map(
        (sentence, index) => `
      <div class="grid-item" onclick="toggleExpand(this)">
        <div class="grid-item-content">
          <h3>Saved Sentence ${index + 1}</h3>
          <div class="grid-item-scroll">
            <p>${sentence.text || sentence}</p>
            ${
              sentence.timestamp
                ? `<small class="text-muted timestamp">${new Date(
                    sentence.timestamp
                  ).toLocaleString()}</small>`
                : ""
            }
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Initialize
  loadHistoryView();
});

// Toggle expand functionality
function toggleExpand(element) {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (item !== element) {
      item.classList.remove("expanded");
    }
  });

  element.classList.toggle("expanded");
}

// Close expanded items when clicking outside
document.addEventListener("click", function (event) {
  const grid = document.getElementById("grid");
  if (grid && !grid.contains(event.target)) {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item) => {
      item.classList.remove("expanded");
    });
  }
});

// Prevent event propagation on grid items
document.querySelectorAll(".grid-item").forEach((item) => {
  item.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});
