function setupNotificationDropdowns() {
  const notificationIcon = document.querySelector(".notifications");
  const messageIcon = document.querySelector(".messages");

  if (notificationIcon) {
    const notificationDropdown = document.createElement("div");
    notificationDropdown.className = "dropdown-content notification-dropdown";
    notificationDropdown.innerHTML = `
      <div class="dropdown-header">Notifications</div>
      <div class="dropdown-item unread">
        <div class="notification-title">Booking Offer</div>
        <div class="notification-text">Check out the rising babysitter</div>
        <div class="notification-time">10 minutes ago</div>
      </div>
      <div class="dropdown-item unread">
        <div class="notification-title">Schedule update</div>
        <div class="notification-text">Your May 15 appointment has been confirmed</div>
        <div class="notification-time">2 minutes ago</div>
      </div>
      <div class="dropdown-footer">View all notifications</div>
    `;
    notificationIcon.appendChild(notificationDropdown);

    notificationIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Notification icon clicked");
      const messageDropdown = document.querySelector(".message-dropdown");
      if (messageDropdown) messageDropdown.style.display = "none";
      notificationDropdown.style.display =
        notificationDropdown.style.display === "block" ? "none" : "block";
    });
  }

  if (messageIcon) {
    const messageDropdown = document.createElement("div");
    messageDropdown.className = "dropdown-content message-dropdown";
    messageDropdown.innerHTML = `
      <div class="dropdown-header">Messages</div>
      <div class="dropdown-item unread">
        <div class="message-sender">BabyVision Support</div>
        <div class="message-preview">New privacy policy update</div>
        <div class="message-time">Yesterday</div>
      </div>
      <div class="dropdown-footer">View all messages</div>
    `;
    messageIcon.appendChild(messageDropdown);

    messageIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Message icon clicked");
      const notificationDropdown = document.querySelector(
        ".notification-dropdown"
      );
      if (notificationDropdown) notificationDropdown.style.display = "none";
      messageDropdown.style.display =
        messageDropdown.style.display === "block" ? "none" : "block";
    });
  }

  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".notifications") &&
      !event.target.closest(".messages")
    ) {
      const dropdowns = document.querySelectorAll(".dropdown-content");
      dropdowns.forEach((dropdown) => (dropdown.style.display = "none"));
    }
  });

  console.log("Notification setup complete");
}
