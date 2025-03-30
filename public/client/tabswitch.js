// Tab Switching Logic
document.addEventListener("DOMContentLoaded", function () {
  // Define these as global variables
  window.tabs = {
    generator: document.getElementById("generator-tab"),
    history: document.getElementById("history-tab"),
    dictionary: document.getElementById("dictionary-tab"),
  };

  window.views = {
    generator: document.getElementById("generator-view"),
    history: document.getElementById("history-view"),
    dictionary: document.getElementById("dictionary-view"),
  };

  // Set up tab switching
  Object.entries(window.tabs).forEach(([name, tab]) => {
    if (tab) {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        switchToView(name);
      });
    }
  });

  // Initialize with Generator view
  switchToView("generator");
});

// Make this function global
window.switchToView = function (viewName) {
  // Hide all views
  Object.values(window.views).forEach((view) => {
    if (view) view.style.display = "none";
  });

  // Remove active class from all tabs
  Object.values(window.tabs).forEach((tab) => {
    if (tab) tab.classList.remove("active");
  });

  // Show selected view and mark tab as active
  if (window.views[viewName]) {
    window.views[viewName].style.display = "block";
    if (window.tabs[viewName]) window.tabs[viewName].classList.add("active");

    // Load specific view logic if needed
    if (viewName === "history" && typeof loadHistoryView === "function") {
      loadHistoryView();
    }
  }
};
