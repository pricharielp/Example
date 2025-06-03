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
      setupChatFunctionality();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  function setupChatFunctionality() {
    const chatInput = document.querySelector(".chat-input input");
    const sendButton = document.querySelector(".chat-input button");
    const chatMessages = document.querySelector(".chat-messages");
    const chatItems = document.querySelectorAll(".chat-item");
    const chatHeader = document.querySelector(".chat-header");

    let currentChat = "Aiih";
    let initialMessagesLoaded = false;

    const firstChatItem = document.querySelector(".chat-item.active");
    if (!firstChatItem.querySelector("img")) {
      firstChatItem.innerHTML = `
        <img src="../Comp/pfp.png" alt="User Photo" />
        <div class="chat-info">
          <h4>Aiih</h4>
          <p>Yes, I am. What time do you need me?</p>
          <span class="timestamp">10:45 AM</span>
        </div>
      `;
    }

    const dummyMessages = {
      "John Smith": [
        {
          sender: "client",
          text: "Hello, are you free next Tuesday?",
          time: "10:15 AM",
        },
        {
          sender: "babysitter",
          text: "Let me check my calendar...",
          time: "10:17 AM",
        },
        {
          sender: "babysitter",
          text: "Yes, I'm available from 9am to 5pm",
          time: "10:18 AM",
        },
        {
          sender: "client",
          text: "Perfect! I'll book you for 10am to 3pm then",
          time: "10:25 AM",
        },
        {
          sender: "babysitter",
          text: "Thank you for your help!",
          time: "11:05 AM",
        },
      ],
      "Sarah Johnson": [
        {
          sender: "client",
          text: "Hi, do you have any weekend availability?",
          time: "Yesterday",
        },
        {
          sender: "babysitter",
          text: "I'm fully booked this weekend",
          time: "Yesterday",
        },
        {
          sender: "client",
          text: "What about next weekend?",
          time: "Yesterday",
        },
        {
          sender: "client",
          text: "Can you work next weekend?",
          time: "2 days ago",
        },
      ],
    };

    loadMessages();

    chatItems.forEach((item) => {
      item.addEventListener("click", function () {
        const contactName = this.querySelector("h4").textContent;

        if (currentChat === contactName) return;

        chatItems.forEach((chat) => chat.classList.remove("active"));
        this.classList.add("active");

        chatHeader.querySelector("img").src = this.querySelector("img").src;
        chatHeader.querySelector("h4").textContent = contactName;

        initialMessagesLoaded = false;
        currentChat = contactName;

        if (currentChat === "Aiih") {
          loadMessages();
        } else {
          loadDummyMessages(contactName);
        }
      });
    });

    sendButton.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", "sent");

      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      const timeStr = `${hours}:${minutes} ${ampm}`;

      messageDiv.innerHTML = `
        <p>${message}</p>
        <span class="message-time">${timeStr}</span>
      `;

      chatMessages.appendChild(messageDiv);

      if (currentChat === "Aiih") {
        const messages = JSON.parse(localStorage.getItem("messages") || "[]");
        messages.push({
          text: message,
          sender: "babysitter",
          timestamp: now.getTime(),
        });
        localStorage.setItem("messages", JSON.stringify(messages));

        updateChatPreview("Aiih", message);
      } else {
        updateChatPreview(currentChat, message);
      }

      chatInput.value = "";

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function loadMessages() {
      if (currentChat !== "Aiih") return;

      const messages = JSON.parse(localStorage.getItem("messages") || "[]");

      if (!initialMessagesLoaded) {
        initialMessagesLoaded = true;

        if (!document.querySelector(".message")) {
          chatMessages.innerHTML = `
            <div class="message received">
              <p>Hi! Are you available this weekend?</p>
              <span class="message-time">10:30 AM</span>
            </div>
            <div class="message sent">
              <p>Yes, I am. What time do you need me?</p>
              <span class="message-time">10:45 AM</span>
            </div>
          `;
        }
      }

      messages.forEach((msg) => {
        const existingMessages = Array.from(
          chatMessages.querySelectorAll(".message")
        );
        const isDuplicate = existingMessages.some((existingMsg) => {
          const msgText = existingMsg.querySelector("p").textContent;
          const msgTime =
            existingMsg.querySelector(".message-time").textContent;
          const date = new Date(msg.timestamp);
          const hours = date.getHours() % 12 || 12;
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const ampm = date.getHours() >= 12 ? "PM" : "AM";
          const timeStr = `${hours}:${minutes} ${ampm}`;

          return (
            msgText === msg.text &&
            (msgTime === timeStr ||
              Math.abs(new Date(msg.timestamp) - new Date()) < 4000)
          );
        });

        if (!isDuplicate) {
          const messageDiv = document.createElement("div");
          messageDiv.classList.add(
            "message",
            msg.sender === "babysitter" ? "sent" : "received"
          );

          const date = new Date(msg.timestamp);
          const hours = date.getHours() % 12 || 12;
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const ampm = date.getHours() >= 12 ? "PM" : "AM";
          const timeStr = `${hours}:${minutes} ${ampm}`;

          messageDiv.innerHTML = `
            <p>${msg.text}</p>
            <span class="message-time">${timeStr}</span>
          `;

          chatMessages.appendChild(messageDiv);
        }
      });

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function loadDummyMessages(contactName) {
      chatMessages.innerHTML = "";

      if (!dummyMessages[contactName]) {
        chatMessages.innerHTML = `
          <div class="message-center">No message history with ${contactName}</div>
        `;
        return;
      }

      dummyMessages[contactName].forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(
          "message",
          msg.sender === "babysitter" ? "sent" : "received"
        );

        messageDiv.innerHTML = `
          <p>${msg.text}</p>
          <span class="message-time">${msg.time}</span>
        `;

        chatMessages.appendChild(messageDiv);
      });

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateChatPreview(contactName, lastMessage) {
      const chatItem = Array.from(chatItems).find(
        (item) => item.querySelector("h4").textContent === contactName
      );

      if (chatItem) {
        const previewElement = chatItem.querySelector(".chat-info p");
        if (previewElement) {
          previewElement.textContent = lastMessage;
        }

        const timestampElement = chatItem.querySelector(".timestamp");
        if (timestampElement) {
          timestampElement.textContent = "Just now";
        }

        const chatList = document.querySelector(".chat-list");
        if (chatList.firstChild !== chatItem) {
          chatList.insertBefore(chatItem, chatList.firstChild);
        }

        chatItems.forEach((item) => item.classList.remove("active"));
        chatItem.classList.add("active");
      }
    }

    setInterval(function () {
      if (currentChat === "Aiih") {
        loadMessages();
      }
    }, 2000);
  }
});
