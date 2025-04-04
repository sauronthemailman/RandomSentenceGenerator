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
      const historyData = JSON.parse(
        localStorage.getItem("sentenceHistory") || "[]"
      );
      updateHistoryGrid(historyData);
    }
  }

  // Update grid with history data
  function updateHistoryGrid(historyItems) {
    if (!grid) return;

    grid.innerHTML = historyItems
      .slice(0, 8)
      .map((item, index) => {
        // Handle both object and string formats
        const sentence = item.sentence || item.text || item;
        const timestamp = item.timestamp ? new Date(item.timestamp) : null;

        return `
          <div class="grid-item" onclick="toggleExpand(this)">
            <div class="grid-item-content">
              <h3>Saved Sentence ${index + 1}</h3>
              <div class="grid-item-scroll">
                <p>${sentence}</p>
                ${
                  timestamp
                    ? `<small class="text-muted timestamp">${timestamp.toLocaleString()}</small>`
                    : ""
                }
              </div>
            </div>
          </div>
        `;
      })
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
