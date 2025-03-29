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
