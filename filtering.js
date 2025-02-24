const filterContent = document.getElementById("filterContent");
const outputContainer = document.getElementById("output-container");

filterContent.addEventListener("show.bs.collapse", () => {
  outputContainer.classList.add("shrink");
});

filterContent.addEventListener("hide.bs.collapse", () => {
  outputContainer.classList.remove("shrink");
});
