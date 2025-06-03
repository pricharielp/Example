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

    let initialMessagesLoaded = false;

    if (!chatInput || !sendButton) {
      const chatWindow = document.querySelector(".chat-window");
      if (chatWindow) {
        if (!document.querySelector(".chat-input")) {
          const chatInputDiv = document.createElement("div");
          chatInputDiv.className = "chat-input";
          chatInputDiv.innerHTML = `
            <input type="text" placeholder="Type a message...">
            <button>➤</button>
          `;
          chatWindow.appendChild(chatInputDiv);
        }
      }
    }

    const updatedChatInput = document.querySelector(".chat-input input");
    const updatedSendButton = document.querySelector(".chat-input button");

    let currentChat = "Mega Toto";

    const dummyMessages = {
      "Ballerina Capuccina": [
        {
          sender: "parent",
          text: "Hello, are you available next weekend?",
          time: "Yesterday",
        },
        {
          sender: "babysitter",
          text: "Yes, I'm available on Saturday from 10am to 6pm",
          time: "Yesterday",
        },
        {
          sender: "parent",
          text: "Perfect! I'll book you for that time",
          time: "Yesterday",
        },
        {
          sender: "babysitter",
          text: "Thank you for hiring me!",
          time: "Yesterday",
        },
      ],
    };

    loadMessages();

    chatItems.forEach((item) => {
      item.addEventListener("click", function () {
        const babysitterName = this.querySelector("h4").textContent;

        if (currentChat === babysitterName) return;

        chatItems.forEach((chat) => chat.classList.remove("active"));
        this.classList.add("active");

        chatHeader.querySelector("img").src = this.querySelector("img").src;
        chatHeader.querySelector("h4").textContent = babysitterName;

        initialMessagesLoaded = false;
        currentChat = babysitterName;

        if (currentChat === "Mega Toto") {
          loadMessages();
        } else {
          loadDummyMessages(currentChat);
        }
      });
    });

    updatedSendButton.addEventListener("click", sendMessage);

    updatedChatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    function sendMessage() {
      const message = updatedChatInput.value.trim();
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

      if (currentChat === "Mega Toto") {
        const messages = JSON.parse(localStorage.getItem("messages") || "[]");
        messages.push({
          text: message,
          sender: "parent",
          timestamp: now.getTime(),
        });
        localStorage.setItem("messages", JSON.stringify(messages));

        updateChatPreview("Mega Toto", message);
      } else {
        updateChatPreview(currentChat, message);
      }

      updatedChatInput.value = "";

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function loadMessages() {
      if (currentChat !== "Mega Toto") return;

      const messages = JSON.parse(localStorage.getItem("messages") || "[]");

      if (!initialMessagesLoaded) {
        initialMessagesLoaded = true;

        if (!document.querySelector(".message")) {
          chatMessages.innerHTML = `
            <div class="message sent">
              <p>Hi! Are you available this weekend?</p>
              <span class="message-time">10:30 AM</span>
            </div>
            <div class="message received">
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
            msg.sender === "parent" ? "sent" : "received"
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
          msg.sender === "parent" ? "sent" : "received"
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
      if (currentChat === "Mega Toto") {
        loadMessages();
      }
    }, 2000);
  }
});
