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
      setupBabysitterInfoButtons();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });
});

const babysitterData = [
  {
    name: "Emily Sigma",
    age: 28,
    experience: "3 years",
    specialization:
      "Infant care specialist with training in early childhood development",
    availability: "Weekdays 8am-6pm, Some weekends",
    education: "Bachelor's in Child Development",
    languages: "English, Spanish",
    hourlyRate: "$25/hour",
    phone: "(555) 123-4567",
    email: "emily.sigma@example.com",
    bio: "Passionate about providing nurturing care for infants. Specializes in developing stimulating activities that promote cognitive and motor skills.",
  },
  {
    name: "Sophia Skibidi",
    age: 32,
    experience: "5 years",
    specialization: "Toddler care and educational activities",
    availability: "Flexible schedule including evenings",
    education: "Master's in Early Education",
    languages: "English, French",
    hourlyRate: "$28/hour",
    phone: "(555) 987-6543",
    email: "sophia.s@example.com",
    bio: "Former preschool teacher with expertise in creative play and educational activities. Known for creating structured but fun environments for children.",
  },
  {
    name: "Tung Tung Willy",
    age: 26,
    experience: "4 years",
    specialization: "CPR certified, special needs care",
    availability: "Full-time availability, including weekends",
    education: "Nursing Assistant Certificate, Special Needs Care Training",
    languages: "English, Mandarin",
    hourlyRate: "$30/hour",
    phone: "(555) 456-7890",
    email: "tungtung.w@example.com",
    bio: "Specialized in caring for children with special needs. Patient, compassionate, and trained in emergency medical procedures.",
  },
];

function setupBabysitterInfoButtons() {
  const cards = document.querySelectorAll(".babysitter-card");

  cards.forEach((card, index) => {
    const buttons = card.querySelectorAll(".contact-btn");
    const infoBtn = buttons[0];
    const hireBtn = buttons[1];
    const sitter = babysitterData[index];

    if (infoBtn) {
      infoBtn.addEventListener("click", () => showBabysitterInfo(sitter));
    }
    if (hireBtn) {
      hireBtn.addEventListener("click", () => showHireConfirmation(sitter));
    }
  });

  function showBabysitterInfo(sitter) {
    removeExistingPopups();

    const popupOverlay = document.createElement("div");
    popupOverlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "info-popup";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-popup";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = removeExistingPopups;

    const content = document.createElement("div");
    content.className = "popup-content";

    const header = document.createElement("div");
    header.className = "popup-header";

    const title = document.createElement("h3");
    title.textContent = sitter.name;

    header.appendChild(title);
    header.appendChild(closeBtn);

    const infoGrid = document.createElement("div");
    infoGrid.className = "info-grid";

    infoGrid.innerHTML = `
      <div class="info-item">
        <strong>Age:</strong> <span>${sitter.age}</span>
      </div>
      <div class="info-item">
        <strong>Experience:</strong> <span>${sitter.experience}</span>
      </div>
      <div class="info-item">
        <strong>Education:</strong> <span>${sitter.education}</span>
      </div>
      <div class="info-item">
        <strong>Languages:</strong> <span>${sitter.languages}</span>
      </div>
      <div class="info-item">
        <strong>Rate:</strong> <span>${sitter.hourlyRate}</span>
      </div>
      <div class="info-item">
        <strong>Availability:</strong> <span>${sitter.availability}</span>
      </div>
      <div class="info-item full-width">
        <strong>Specialization:</strong> <span>${sitter.specialization}</span>
      </div>
      <div class="info-item full-width">
        <strong>Contact:</strong> <span>${sitter.phone} | ${sitter.email}</span>
      </div>
      <div class="info-item full-width bio">
        <strong>Bio:</strong> <span>${sitter.bio}</span>
      </div>
    `;

    content.appendChild(header);
    content.appendChild(infoGrid);

    const hireButton = document.createElement("button");
    hireButton.className = "hire-btn-large";
    hireButton.textContent = "Hire Now";
    hireButton.addEventListener("click", () => {
      removeExistingPopups();
      showHireConfirmation(sitter);
    });

    content.appendChild(hireButton);
    popup.appendChild(content);
    popupOverlay.appendChild(popup);

    document.body.appendChild(popupOverlay);

    setTimeout(() => {
      popupOverlay.style.opacity = "1";
      popup.style.transform = "translateY(0)";
    }, 10);
  }

  function showHireConfirmation(sitter) {
    removeExistingPopups();

    const popupOverlay = document.createElement("div");
    popupOverlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "hire-popup";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-popup";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = removeExistingPopups;

    const content = document.createElement("div");
    content.className = "popup-content";

    const header = document.createElement("div");
    header.className = "popup-header";

    const title = document.createElement("h3");
    title.textContent = `Hire ${sitter.name}`;

    header.appendChild(title);
    header.appendChild(closeBtn);

    const hireForm = document.createElement("form");
    hireForm.className = "hire-form";

    hireForm.innerHTML = `
      <div class="form-group">
        <label for="hire-date">Date:</label>
        <input type="date" id="hire-date" required>
      </div>
      <div class="form-group time-group">
        <div>
          <label for="start-time">Start Time:</label>
          <input type="time" id="start-time" required>
        </div>
        <div>
          <label for="end-time">End Time:</label>
          <input type="time" id="end-time" required>
        </div>
      </div>
      <div class="form-group">
        <label for="notes">Special Instructions:</label>
        <textarea id="notes" rows="3"></textarea>
      </div>
      <div class="price-estimate">
        <p>Estimated cost: <span id="price-estimate">$0.00</span></p>
        <p class="small">(Based on ${sitter.hourlyRate})</p>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="confirm-btn">Confirm Booking</button>
      </div>
    `;

    content.appendChild(header);
    content.appendChild(hireForm);
    popup.appendChild(content);
    popupOverlay.appendChild(popup);

    document.body.appendChild(popupOverlay);

    const cancelBtn = popup.querySelector(".cancel-btn");
    cancelBtn.addEventListener("click", removeExistingPopups);

    const startTimeInput = popup.querySelector("#start-time");
    const endTimeInput = popup.querySelector("#end-time");
    const priceEstimate = popup.querySelector("#price-estimate");
    const hourlyRate = parseInt(sitter.hourlyRate.replace(/\D/g, ""));

    function updatePrice() {
      if (startTimeInput.value && endTimeInput.value) {
        const startTime = new Date(`2023-01-01T${startTimeInput.value}`);
        const endTime = new Date(`2023-01-01T${endTimeInput.value}`);

        if (endTime > startTime) {
          const hours = (endTime - startTime) / (1000 * 60 * 60);
          const price = hours * hourlyRate;
          priceEstimate.textContent = `$${price.toFixed(2)}`;
        }
      }
    }

    startTimeInput.addEventListener("change", updatePrice);
    endTimeInput.addEventListener("change", updatePrice);

    hireForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const successOverlay = document.createElement("div");
      successOverlay.className = "success-overlay";

      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>Booking Confirmed!</h3>
        <p>You have successfully booked ${sitter.name}.</p>
        <p>A confirmation has been sent to your email.</p>
        <button class="close-success">Close</button>
      `;

      successOverlay.appendChild(successMessage);
      document.body.appendChild(successOverlay);

      setTimeout(() => {
        successOverlay.style.opacity = "1";
        successMessage.style.transform = "translateY(0)";
      }, 10);

      const closeSuccessBtn = successMessage.querySelector(".close-success");
      closeSuccessBtn.addEventListener("click", () => {
        successOverlay.style.opacity = "0";
        successMessage.style.transform = "translateY(20px)";
        setTimeout(() => {
          document.body.removeChild(successOverlay);
          removeExistingPopups();
        }, 300);
      });
    });

    setTimeout(() => {
      popupOverlay.style.opacity = "1";
      popup.style.transform = "translateY(0)";
    }, 10);
  }

  function removeExistingPopups() {
    const existingOverlays = document.querySelectorAll(".popup-overlay");
    existingOverlays.forEach((overlay) => {
      overlay.style.opacity = "0";
      const popup = overlay.querySelector(".info-popup, .hire-popup");
      if (popup) {
        popup.style.transform = "translateY(20px)";
      }
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    });
  }
}
