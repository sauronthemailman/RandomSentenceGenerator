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

//Dictionary functions//

async function showWord() {

  fetch
  
}