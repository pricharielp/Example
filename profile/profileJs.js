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
      setupChildrenFunctionality();
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });
});

function setupChildrenFunctionality() {
  const addBtn = document.querySelector(".children-section .add-btn");
  const editBtn = document.querySelector(".children-section .edit-btn");

  loadChildren();

  addBtn.addEventListener("click", showAddChildModal);
  editBtn.addEventListener("click", toggleEditMode);

  function showAddChildModal() {
    removeExistingModals();

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "child-modal";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    const title = document.createElement("h3");
    title.textContent = "Add Child";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-modal";
    closeBtn.textContent = "×";
    closeBtn.onclick = removeExistingModals;

    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);

    const form = document.createElement("form");
    form.className = "child-form";
    form.innerHTML = `
      <div class="form-group">
        <label for="child-name">Child's Name</label>
        <input type="text" id="child-name" required>
      </div>
      <div class="form-group">
        <label for="child-age">Age (Years)</label>
        <input type="number" id="child-age" min="0" max="18" required>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Add Child</button>
      </div>
    `;

    modal.appendChild(modalHeader);
    modal.appendChild(form);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    form
      .querySelector(".cancel-btn")
      .addEventListener("click", removeExistingModals);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("child-name").value;
      const age = document.getElementById("child-age").value;

      addChild(name, age);
      removeExistingModals();
    });

    setTimeout(() => {
      modalOverlay.style.opacity = "1";
      modal.style.transform = "translateY(0)";
    }, 10);
  }

  function toggleEditMode() {
    const childrenGrid = document.querySelector(".children-grid");
    const childCards = childrenGrid.querySelectorAll(".child-card");

    if (childrenGrid.classList.contains("edit-mode")) {
      childrenGrid.classList.remove("edit-mode");
      editBtn.textContent = "Edit";

      document
        .querySelectorAll(".delete-child-btn")
        .forEach((btn) => btn.remove());

      document
        .querySelectorAll(".edit-child-btn")
        .forEach((btn) => btn.remove());

      saveChildren();
    } else {
      childrenGrid.classList.add("edit-mode");
      editBtn.textContent = "Done";

      childCards.forEach((card) => {
        if (!card.querySelector(".delete-child-btn")) {
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "delete-child-btn";
          deleteBtn.innerHTML = "×";
          deleteBtn.addEventListener("click", function () {
            card.classList.add("fade-out");
            setTimeout(() => {
              card.remove();
              saveChildren();
            }, 300);
          });
          card.appendChild(deleteBtn);
        }

        if (!card.querySelector(".edit-child-btn")) {
          const editChildBtn = document.createElement("button");
          editChildBtn.className = "edit-child-btn";
          editChildBtn.innerHTML = "✎";
          editChildBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            const name = card.querySelector("h4").textContent;
            const ageText = card.querySelector("p").textContent;
            const age = parseInt(ageText.match(/\d+/)[0]);

            showEditChildModal(card, name, age);
          });
          card.appendChild(editChildBtn);
        }
      });
    }
  }

  function showEditChildModal(cardElement, name, age) {
    removeExistingModals();

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "child-modal";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    const title = document.createElement("h3");
    title.textContent = "Edit Child";

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-modal";
    closeBtn.textContent = "×";
    closeBtn.onclick = removeExistingModals;

    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);

    const form = document.createElement("form");
    form.className = "child-form";
    form.innerHTML = `
      <div class="form-group">
        <label for="edit-child-name">Child's Name</label>
        <input type="text" id="edit-child-name" value="${name}" required>
      </div>
      <div class="form-group">
        <label for="edit-child-age">Age (Years)</label>
        <input type="number" id="edit-child-age" min="0" max="18" value="${age}" required>
      </div>
      <div class="form-actions">
        <button type="button" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Save Changes</button>
      </div>
    `;

    modal.appendChild(modalHeader);
    modal.appendChild(form);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    form
      .querySelector(".cancel-btn")
      .addEventListener("click", removeExistingModals);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const newName = document.getElementById("edit-child-name").value;
      const newAge = document.getElementById("edit-child-age").value;

      cardElement.querySelector("h4").textContent = newName;
      cardElement.querySelector("p").textContent = `${newAge} years old`;

      saveChildren();
      removeExistingModals();
    });

    setTimeout(() => {
      modalOverlay.style.opacity = "1";
      modal.style.transform = "translateY(0)";
    }, 10);
  }

  function addChild(name, age) {
    const childrenGrid = document.querySelector(".children-grid");
    const actionButtons = document.querySelector(".action-buttons");

    const childCard = document.createElement("div");
    childCard.className = "child-card";
    childCard.innerHTML = `
      <h4>${name}</h4>
      <p>${age} years old</p>
    `;

    childrenGrid.insertBefore(childCard, actionButtons);

    childCard.classList.add("fade-in");
    setTimeout(() => {
      childCard.classList.remove("fade-in");
    }, 500);

    if (childrenGrid.classList.contains("edit-mode")) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-child-btn";
      deleteBtn.innerHTML = "×";
      deleteBtn.addEventListener("click", function () {
        childCard.classList.add("fade-out");
        setTimeout(() => {
          childCard.remove();
          saveChildren();
        }, 300);
      });
      childCard.appendChild(deleteBtn);

      const editChildBtn = document.createElement("button");
      editChildBtn.className = "edit-child-btn";
      editChildBtn.innerHTML = "✎";
      editChildBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        showEditChildModal(childCard, name, age);
      });
      childCard.appendChild(editChildBtn);
    }

    saveChildren();
  }

  function removeExistingModals() {
    const existingOverlays = document.querySelectorAll(".modal-overlay");
    existingOverlays.forEach((overlay) => {
      overlay.style.opacity = "0";
      const modal = overlay.querySelector(".child-modal");
      if (modal) {
        modal.style.transform = "translateY(20px)";
      }
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    });
  }

  function saveChildren() {
    const children = [];
    document.querySelectorAll(".child-card").forEach((card) => {
      const name = card.querySelector("h4").textContent;
      const ageText = card.querySelector("p").textContent;
      const age = parseInt(ageText.match(/\d+/)[0]);

      children.push({ name, age });
    });

    localStorage.setItem("babyVisionChildren", JSON.stringify(children));
  }

  function loadChildren() {
    let children = localStorage.getItem("babyVisionChildren");
    if (!children) {
      return;
    }

    children = JSON.parse(children);

    const childrenGrid = document.querySelector(".children-grid");
    const actionButtons = document.querySelector(".action-buttons");

    document.querySelectorAll(".child-card").forEach((card) => card.remove());

    children.forEach((child) => {
      const childCard = document.createElement("div");
      childCard.className = "child-card";
      childCard.innerHTML = `
        <h4>${child.name}</h4>
        <p>${child.age} years old</p>
      `;

      childrenGrid.insertBefore(childCard, actionButtons);
    });
  }
}
