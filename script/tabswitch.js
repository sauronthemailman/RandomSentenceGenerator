// tabswitch.js
document.addEventListener("DOMContentLoaded", function () {
  const generatorTab = document.getElementById("generator-tab");
  const historyTab = document.getElementById("history-tab");
  const dictionaryTab = document.getElementById("dictionary-tab");

  // Set up tab switching
  generatorTab.addEventListener("click", function (e) {
    e.preventDefault();
    switchToView("generator");
  });

  historyTab.addEventListener("click", function (e) {
    e.preventDefault();
    switchToView("history");
  });

  dictionaryTab.addEventListener("click", function (e) {
    e.preventDefault();
    switchToView("dictionary");
  });

  // Initialize with Generator view
  switchToView("generator");
});

function switchToView(viewName) {
  const generatorTab = document.getElementById("generator-tab");
  const historyTab = document.getElementById("history-tab");
  const dictionaryTab = document.getElementById("dictionary-tab");
  const generatorView = document.getElementById("generator-view");
  const historyView = document.getElementById("history-view");
  const dictionaryView = document.getElementById("dictionary-view");

  // Hide all views
  generatorView.style.display = "none";
  historyView.style.display = "none";
  dictionaryView.style.display = "none";

  // Remove active class from all tabs
  generatorTab.classList.remove("active");
  historyTab.classList.remove("active");
  dictionaryTab.classList.remove("active");

  // Show selected view and mark tab as active
  switch (viewName) {
    case "generator":
      generatorView.style.display = "block";
      generatorTab.classList.add("active");
      break;
    case "history":
      historyView.style.display = "block";
      historyTab.classList.add("active");
      if (typeof loadHistoryView === "function") {
        loadHistoryView();
      }
      break;
    case "dictionary":
      dictionaryView.style.display = "block";
      dictionaryTab.classList.add("active");
      if (typeof initializeDictionary === "function") {
        initializeDictionary();
      }
      break;
  }
}
