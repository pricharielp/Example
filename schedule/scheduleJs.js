document.addEventListener("DOMContentLoaded", function () {
  fetch("../Global/Dashboard.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("dashboard-container").innerHTML = html;
      return fetch("../Global/Side.html");
    })
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-container").innerHTML = html;
      setTimeout(() => utils.setupSidebarToggle(), 100);
      scheduleSharing.loadInitialSchedules();
      setupScheduleFunctionality();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });

  function setupScheduleFunctionality() {
    const addButton = document.querySelector(".add-btn");
    const editButton = document.querySelector(".edit-btn");
    const deleteButton = document.querySelector(".delete-btn");
    const scheduleContainer = document.querySelector(".schedule-container");
    let selectedCard = null;

    function setupDoneButtons() {
      document.querySelectorAll(".done-btn").forEach((btn) => {
        if (btn.getAttribute("data-setup") === "true") return;
        btn.setAttribute("data-setup", "true");

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          const card = this.closest(".schedule-card");

          card.style.backgroundColor = "#4caf50";
          card.style.color = "white";

          const statusElement = card.querySelector(".schedule-status");
          statusElement.textContent = "Completed";
          statusElement.classList.remove("active");
          statusElement.style.backgroundColor = "rgba(255, 255, 255, 0.3)";

          card.setAttribute("data-completed", "true");

          if (card === selectedCard) {
            card.classList.remove("selected");
            selectedCard = null;
          }

          this.style.display = "none";
          saveSchedules();

          if (typeof scheduleSharing !== "undefined") {
            scheduleSharing.updateScheduleDisplays();
          }
        });
      });
    }

    function generateTimeOptions() {
      let options = "";
      for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, "0");
        options += `<option value="${formattedHour}:00">${formattedHour}:00</option>`;
        options += `<option value="${formattedHour}:30">${formattedHour}:30</option>`;
      }
      return options;
    }

    function createModal(title, formContent) {
      const modalOverlay = document.createElement("div");
      modalOverlay.className = "modal-overlay";

      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";

      const modalHeader = document.createElement("div");
      modalHeader.className = "modal-header";

      const modalTitle = document.createElement("h3");
      modalTitle.textContent = title;

      const closeButton = document.createElement("button");
      closeButton.innerHTML = "×";
      closeButton.className = "modal-close";
      closeButton.onclick = () => modalOverlay.remove();

      modalHeader.appendChild(modalTitle);
      modalHeader.appendChild(closeButton);

      modalContent.appendChild(modalHeader);
      modalContent.appendChild(formContent);
      modalOverlay.appendChild(modalContent);

      document.body.appendChild(modalOverlay);

      return modalOverlay;
    }

    function addSchedule() {
      const form = document.createElement("form");

      const activityDiv = document.createElement("div");
      activityDiv.className = "form-group";

      const activityLabel = document.createElement("label");
      activityLabel.textContent = "Activity:";
      activityLabel.setAttribute("for", "activity");

      const activityInput = document.createElement("input");
      activityInput.id = "activity";
      activityInput.type = "text";
      activityInput.required = true;

      activityDiv.appendChild(activityLabel);
      activityDiv.appendChild(activityInput);

      const timeDiv = document.createElement("div");
      timeDiv.className = "form-group";
      timeDiv.style.display = "flex";
      timeDiv.style.gap = "10px";

      const startDiv = document.createElement("div");
      startDiv.style.flex = "1";

      const startLabel = document.createElement("label");
      startLabel.textContent = "Start Time:";
      startLabel.setAttribute("for", "startTime");

      const startSelect = document.createElement("select");
      startSelect.id = "startTime";
      startSelect.required = true;
      startSelect.innerHTML = generateTimeOptions();

      startDiv.appendChild(startLabel);
      startDiv.appendChild(startSelect);

      const endDiv = document.createElement("div");
      endDiv.style.flex = "1";

      const endLabel = document.createElement("label");
      endLabel.textContent = "End Time:";
      endLabel.setAttribute("for", "endTime");

      const endSelect = document.createElement("select");
      endSelect.id = "endTime";
      endSelect.required = true;
      endSelect.innerHTML = generateTimeOptions();

      endDiv.appendChild(endLabel);
      endDiv.appendChild(endSelect);

      timeDiv.appendChild(startDiv);
      timeDiv.appendChild(endDiv);

      const formActions = document.createElement("div");
      formActions.className = "form-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "cancel-btn";

      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.textContent = "Add Schedule";
      submitBtn.className = "add-btn";

      formActions.appendChild(cancelBtn);
      formActions.appendChild(submitBtn);

      form.appendChild(activityDiv);
      form.appendChild(timeDiv);
      form.appendChild(formActions);

      const modal = createModal("Add New Schedule", form);

      cancelBtn.addEventListener("click", () => modal.remove());

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const activity = activityInput.value;
        const startTime = startSelect.value;
        const endTime = endSelect.value;

        if (
          new Date(`2023-01-01T${endTime}`) <=
          new Date(`2023-01-01T${startTime}`)
        ) {
          alert("End time must be after start time");
          return;
        }

        const newCard = document.createElement("div");
        newCard.className = "schedule-card upcoming";

        const cardContent = document.createElement("div");
        cardContent.className = "schedule-card-content";

        cardContent.innerHTML = `
          <div class="schedule-time">${startTime} - ${endTime}</div>
          <div class="schedule-info">
            <h3>${activity}</h3>
            <div class="schedule-status">Upcoming</div>
          </div>
        `;

        const doneBtn = document.createElement("button");
        doneBtn.className = "done-btn";
        doneBtn.textContent = "Mark Done";

        cardContent.appendChild(doneBtn);
        newCard.appendChild(cardContent);

        addCardClickHandler(newCard);
        scheduleContainer.appendChild(newCard);

        setupDoneButtons();
        modal.remove();
        saveSchedules();

        if (typeof scheduleSharing !== "undefined") {
          scheduleSharing.updateScheduleDisplays();
        }
      });
    }

    function editSchedule() {
      if (!selectedCard) {
        alert("Please select a schedule to edit");
        return;
      }

      const timeText = selectedCard.querySelector(".schedule-time").textContent;
      const activity =
        selectedCard.querySelector(".schedule-info h3").textContent;
      const [startTime, endTime] = timeText.split(" - ");

      const form = document.createElement("form");

      const activityDiv = document.createElement("div");
      activityDiv.className = "form-group";

      const activityLabel = document.createElement("label");
      activityLabel.textContent = "Activity:";
      activityLabel.setAttribute("for", "activity");

      const activityInput = document.createElement("input");
      activityInput.id = "activity";
      activityInput.type = "text";
      activityInput.value = activity;
      activityInput.required = true;

      activityDiv.appendChild(activityLabel);
      activityDiv.appendChild(activityInput);

      const timeDiv = document.createElement("div");
      timeDiv.className = "form-group";
      timeDiv.style.display = "flex";
      timeDiv.style.gap = "10px";

      const startDiv = document.createElement("div");
      startDiv.style.flex = "1";

      const startLabel = document.createElement("label");
      startLabel.textContent = "Start Time:";
      startLabel.setAttribute("for", "startTime");

      const startSelect = document.createElement("select");
      startSelect.id = "startTime";
      startSelect.required = true;
      startSelect.innerHTML = generateTimeOptions();
      startSelect.value = startTime;

      startDiv.appendChild(startLabel);
      startDiv.appendChild(startSelect);

      const endDiv = document.createElement("div");
      endDiv.style.flex = "1";

      const endLabel = document.createElement("label");
      endLabel.textContent = "End Time:";
      endLabel.setAttribute("for", "endTime");

      const endSelect = document.createElement("select");
      endSelect.id = "endTime";
      endSelect.required = true;
      endSelect.innerHTML = generateTimeOptions();
      endSelect.value = endTime;

      endDiv.appendChild(endLabel);
      endDiv.appendChild(endSelect);

      timeDiv.appendChild(startDiv);
      timeDiv.appendChild(endDiv);

      const formActions = document.createElement("div");
      formActions.className = "form-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "cancel-btn";

      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.textContent = "Update Schedule";
      submitBtn.className = "edit-btn";

      formActions.appendChild(cancelBtn);
      formActions.appendChild(submitBtn);

      form.appendChild(activityDiv);
      form.appendChild(timeDiv);
      form.appendChild(formActions);

      const modal = createModal("Edit Schedule", form);

      cancelBtn.addEventListener("click", () => modal.remove());

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const newActivity = activityInput.value;
        const newStartTime = startSelect.value;
        const newEndTime = endSelect.value;

        if (
          new Date(`2023-01-01T${newEndTime}`) <=
          new Date(`2023-01-01T${newStartTime}`)
        ) {
          alert("End time must be after start time");
          return;
        }

        selectedCard.querySelector(
          ".schedule-time"
        ).textContent = `${newStartTime} - ${newEndTime}`;
        selectedCard.querySelector(".schedule-info h3").textContent =
          newActivity;

        modal.remove();
        selectedCard.classList.remove("selected");
        selectedCard = null;
        saveSchedules();

        if (typeof scheduleSharing !== "undefined") {
          scheduleSharing.updateScheduleDisplays();
        }
      });
    }

    function deleteSchedule() {
      if (!selectedCard) {
        alert("Please select a schedule to delete");
        return;
      }

      const activity =
        selectedCard.querySelector(".schedule-info h3").textContent;

      const confirmDiv = document.createElement("div");

      const confirmText = document.createElement("p");
      confirmText.textContent = `Are you sure you want to delete "${activity}"?`;
      confirmText.style.marginBottom = "20px";

      const buttonDiv = document.createElement("div");
      buttonDiv.className = "form-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "cancel-btn";

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.textContent = "Delete";
      confirmBtn.className = "delete-btn";

      buttonDiv.appendChild(cancelBtn);
      buttonDiv.appendChild(confirmBtn);

      confirmDiv.appendChild(confirmText);
      confirmDiv.appendChild(buttonDiv);

      const modal = createModal("Confirm Delete", confirmDiv);

      cancelBtn.addEventListener("click", () => modal.remove());
      confirmBtn.addEventListener("click", function () {
        selectedCard.remove();
        modal.remove();
        selectedCard = null;
        saveSchedules();

        if (typeof scheduleSharing !== "undefined") {
          scheduleSharing.updateScheduleDisplays();
        }
      });
    }

    function saveSchedules() {
      const schedules = [];
      document
        .querySelectorAll(".schedule-container .schedule-card")
        .forEach((card) => {
          if (!card.parentElement.classList.contains("main-panel")) {
            const timeText = card.querySelector(".schedule-time").textContent;
            const activity =
              card.querySelector(".schedule-info h3").textContent;
            const status = card.querySelector(".schedule-status").textContent;
            const isActive = card
              .querySelector(".schedule-status")
              .classList.contains("active");
            const isCompleted = card.getAttribute("data-completed") === "true";
            const backgroundColor = card.style.backgroundColor;

            schedules.push({
              time: timeText,
              activity: activity,
              status: status,
              isActive: isActive,
              isCompleted: isCompleted,
              backgroundColor: backgroundColor,
            });
          }
        });

      localStorage.setItem("schedules", JSON.stringify(schedules));
    }

    function addCardClickHandler(card) {
      card.addEventListener("click", function (e) {
        if (e.target.classList.contains("done-btn")) return;

        if (selectedCard === this) {
          this.classList.remove("selected");
          selectedCard = null;
          return;
        }

        if (selectedCard) {
          selectedCard.classList.remove("selected");
        }

        this.classList.add("selected");
        selectedCard = this;
      });
    }

    document.querySelectorAll(".schedule-card").forEach((card) => {
      const doneBtn = card.querySelector(".done-btn");
      if (doneBtn) {
        const cardContent = card.querySelector(".schedule-card-content");
        if (!cardContent.contains(doneBtn)) {
          doneBtn.remove();
          cardContent.appendChild(doneBtn);
        }
      }

      addCardClickHandler(card);
    });

    setupDoneButtons();

    addButton.addEventListener("click", addSchedule);
    editButton.addEventListener("click", editSchedule);
    deleteButton.addEventListener("click", deleteSchedule);
  }
});
