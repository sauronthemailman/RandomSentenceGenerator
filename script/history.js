// History animations
function toggleExpand(element) {
  // Remove expanded class from all grid items
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (item !== element) {
      item.classList.remove("expanded");
      // Ensure other items remain visible
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
  const gridItems = document.querySelectorAll(".grid-item");

  // Check if the click is outside the grid
  if (grid && !grid.contains(event.target)) {
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
//-------------------------------------------------------------------//
// Modified history.js
document.addEventListener('DOMContentLoaded', function() {
  // Try to load history from localStorage (fallback for demo)
  const loadHistory = () => {
    // First try to fetch from history.json
    fetch('./json/history.json')
      .then(response => {
        if (!response.ok) throw new Error('No history.json');
        return response.json();
      })
      .then(historyData => {
        updateHistoryGrid(historyData);
      })
      .catch(error => {
        console.log("Falling back to localStorage history");
        // Fallback to localStorage
        const historyData = JSON.parse(localStorage.getItem('sentenceHistory') || []);
        updateHistoryGrid(historyData);
      });
  };

  loadHistory();
});

// Keep the existing toggleExpand and other functions
function toggleExpand(element) {
  // Remove expanded class from all grid items
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (item !== element) {
      item.classList.remove("expanded");
      // Ensure other items remain visible
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
  const gridItems = document.querySelectorAll(".grid-item");

  // Check if the click is outside the grid
  if (grid && !grid.contains(event.target)) {
    gridItems.forEach((item) => {
      item.classList.remove("expanded");
      item.style.opacity = "1";
      item.style.visibility = "visible";
    });
  }
});

// history.js
function loadHistoryView() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  
  // Load history from localStorage
  const historyData = JSON.parse(localStorage.getItem('sentenceHistory') || []);
  
  // Clear existing grid items
  grid.innerHTML = '';
  
  // Create grid items for each saved sentence
  historyData.slice(0, 8).forEach((sentence, index) => {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.onclick = function() { toggleExpand(this); };
    
    gridItem.innerHTML = `
      <div class="grid-item-content">
        <h3>Saved Sentence ${index + 1}</h3>
        <div class="grid-item-scroll">
          <p>${sentence}</p>
        </div>
      </div>
    `;
    
    grid.appendChild(gridItem);
  });
  
  // Reattach event listeners for the new grid items
  document.querySelectorAll(".grid-item").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });
}

function toggleExpand(element) {
  // Remove expanded class from all grid items
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (item !== element) {
      item.classList.remove("expanded");
      // Ensure other items remain visible
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
  const gridItems = document.querySelectorAll(".grid-item");

  // Check if the click is outside the grid
  if (grid && !grid.contains(event.target)) {
    gridItems.forEach((item) => {
      item.classList.remove("expanded");
      item.style.opacity = "1";
      item.style.visibility = "visible";
    });
  }
});

