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
      initializeOrders();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  function initializeOrders() {
    document.querySelectorAll(".order-card").forEach((card) => {
      const orderId = card.getAttribute("data-id");
      const savedStatus =
        localStorage.getItem(`order_${orderId}_status`) || "pending";

      card.setAttribute("data-status", savedStatus);
      card.classList.remove(
        "status-pending",
        "status-finished",
        "status-cancelled"
      );
      card.classList.add(`status-${savedStatus}`);

      if (savedStatus !== "pending") {
        const actionButtons = card.querySelector(".action-buttons");
        if (actionButtons) {
          actionButtons.style.display = "none";
        }
      }

      const finishBtn = card.querySelector(".btn-finish");
      if (finishBtn) {
        finishBtn.addEventListener("click", function () {
          saveOrderStatus(orderId, "finished");
        });
      }

      const cancelBtn = card.querySelector(".btn-cancel");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
          saveOrderStatus(orderId, "cancelled");
        });
      }
    });
  }

  function saveOrderStatus(orderId, status) {
    localStorage.setItem(`order_${orderId}_status`, status);

    const cards = document.querySelectorAll(
      `.order-card[data-id="${orderId}"]`
    );
    cards.forEach((card) => {
      card.setAttribute("data-status", status);
      card.classList.remove(
        "status-pending",
        "status-finished",
        "status-cancelled"
      );
      card.classList.add(`status-${status}`);

      const actionButtons = card.querySelector(".action-buttons");
      if (actionButtons) {
        actionButtons.style.display = "none";
      }
    });
  }
});
