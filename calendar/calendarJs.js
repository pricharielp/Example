document.addEventListener("DOMContentLoaded", function () {
  fetch("../Global/DashboardBb.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("dashboard-container").innerHTML = html;

      if (typeof setupNotificationDropdowns === "function") {
        setupNotificationDropdowns();
      } else {
        console.warn("setupNotificationDropdowns not found!");
      }

      return fetch("../Global/SideBb.html");
    })
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-container").innerHTML = html;
      setTimeout(() => utils.setupSidebarToggle(), 100);
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  const calendarEntries = document.querySelectorAll(".calendar-entry");
  calendarEntries.forEach((entry) => {
    const orderId = entry.getAttribute("data-id");
    const savedStatus =
      localStorage.getItem(`order_${orderId}_status`) || "pending";

    entry.classList.remove(
      "status-pending",
      "status-finished",
      "status-cancelled"
    );
    entry.classList.add(`status-${savedStatus}`);

    if (savedStatus !== "pending") {
      const actions = entry.querySelector(".entry-actions");
      if (actions) {
        actions.style.display = "none";
      }
    }
  });

  document.querySelectorAll(".btn-cancel").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const entry = this.closest(".calendar-entry");
      const orderId = entry.getAttribute("data-id");

      localStorage.setItem(`order_${orderId}_status`, "cancelled");
      entry.classList.remove("status-pending", "status-finished");
      entry.classList.add("status-cancelled");

      const actions = entry.querySelector(".entry-actions");
      if (actions) {
        actions.style.display = "none";
      }

      e.stopPropagation();
    });
  });
});
