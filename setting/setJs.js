document.addEventListener("DOMContentLoaded", function () {
  fetch("../Global/Dashboard.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("dashboard-container").innerHTML = html;

      if (typeof setupNotificationDropdowns === "function") {
        setupNotificationDropdowns();
      } else {
        console.warn("setupNotificationDropdowns not found!");
      }

      return fetch("../Global/Side.html");
    })
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-container").innerHTML = html;
      setTimeout(() => utils.setupSidebarToggle(), 100);
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });
});
