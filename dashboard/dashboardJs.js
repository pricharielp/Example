function updateDateTime() {
  const now = new Date();
  const dateEl = document.querySelector(".current-date");
  const timeEl = document.querySelector(".current-time");

  if (dateEl && timeEl) {
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = now.toLocaleDateString("en-US", dateOptions);
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");

    dateEl.textContent = date;
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;

    if (minutes === "00" && seconds === "00") {
      scheduleSharing.updateScheduleDisplays();
    }
  }
}

function setupTipsDropdowns() {
  const tipBoxes = document.querySelectorAll(".tip-box");

  tipBoxes.forEach((box) => {
    const tipCategory = box.getAttribute("data-category");
    const dropdownContent = box.querySelector(".tip-dropdown-content");

    if (dropdownContent) {
      dropdownContent.style.maxHeight = "0";
      dropdownContent.style.opacity = "0";

      box.addEventListener("mouseenter", () => {
        dropdownContent.style.maxHeight = "500px";
        dropdownContent.style.opacity = "1";
      });

      box.addEventListener("mouseleave", () => {
        dropdownContent.style.maxHeight = "0";
        dropdownContent.style.opacity = "0";
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("../Global/Dashboard.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("dashboard-container").innerHTML = html;

      if (typeof setupNotificationDropdowns === "function") {
        setupNotificationDropdowns();
      }

      return fetch("../Global/Side.html");
    })
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-container").innerHTML = html;
      setTimeout(() => utils.setupSidebarToggle(), 100);

      updateDateTime();
      setInterval(updateDateTime, 1000);

      scheduleSharing.updateScheduleDisplays();
      setupTipsDropdowns();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });
});
