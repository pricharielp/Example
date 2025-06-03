document.addEventListener("DOMContentLoaded", function () {
  const calendarData = {
    currentMonth: 4,
    currentYear: 2025,
    selectedDate: "2025-05-10",
    events: {
      "2025-05-03": { hasEvent: true, status: "pending" },
      "2025-05-10": { hasEvent: true, status: "pending" },
      "2025-05-12": { hasEvent: true, status: "pending" },
      "2025-05-15": { hasEvent: true, status: "pending" },
      "2025-05-22": { hasEvent: true, status: "pending" },
    },
  };

  const scheduleData = {
    "2025-05-03": {
      clientName: "Jotaro K.",
      time: "09:00-14:00",
      date: "03/05/2025",
      price: "Rp. 750.000",
      status: "pending",
    },
    "2025-05-10": {
      clientName: "Pika Pika",
      time: "08:00-17:00",
      date: "10/05/2025",
      price: "Rp. 1.000.000",
      status: "pending",
    },
    "2025-05-12": {
      clientName: "Kodok",
      time: "08:00-16:00",
      date: "12/05/2025",
      price: "Rp. 1.300.000",
      status: "pending",
    },
    "2025-05-15": {
      clientName: "GOAT",
      time: "06:00-17:00",
      date: "15/05/2025",
      price: "Rp. 1.100.000",
      status: "pending",
    },
    "2025-05-22": {
      clientName: "Naruto",
      time: "10:00-16:00",
      date: "22/05/2025",
      price: "Rp. 850.000",
      status: "pending",
    },
  };

  const partnerScheduleData = {
    "2025-05-03": {
      clientName: "Kujo",
      time: "11:00-16:00",
      date: "03/05/2025",
      price: "Rp. 650.000",
      status: "pending",
    },
    "2025-05-10": {
      clientName: "Char Char",
      time: "10:00-19:00",
      date: "10/05/2025",
      price: "Rp. 860.000",
      status: "pending",
    },
    "2025-05-12": {
      clientName: "Kaeru",
      time: "10:00-18:00",
      date: "12/05/2025",
      price: "Rp. 1.347.000",
      status: "pending",
    },
    "2025-05-15": {
      clientName: "MVP",
      time: "08:00-19:00",
      date: "15/05/2025",
      price: "Rp. 950.000",
      status: "pending",
    },
    "2025-05-22": {
      clientName: "Sasuke",
      time: "12:00-18:00",
      date: "22/05/2025",
      price: "Rp. 920.000",
      status: "pending",
    },
  };

  function saveOrderStatus(orderId, status) {
    localStorage.setItem(`order_${orderId}_status`, status);

    if (scheduleData[orderId]) {
      scheduleData[orderId].status = status;
    }
    if (calendarData.events[orderId]) {
      calendarData.events[orderId].status = status;
    }

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

      const actionButtons = card.querySelector(".order-actions");
      if (actionButtons) {
        if (status !== "pending") {
          actionButtons.style.display = "none";
        }
      }
    });

    updateCalendarIndicators();
  }

  function initializeOrderCards() {
    document.querySelectorAll(".order-card").forEach((card) => {
      const orderId = card.getAttribute("data-id");
      const savedStatus =
        localStorage.getItem(`order_${orderId}_status`) || "pending";

      if (scheduleData[orderId]) {
        scheduleData[orderId].status = savedStatus;
      }
      if (calendarData.events[orderId]) {
        calendarData.events[orderId].status = savedStatus;
      }

      card.setAttribute("data-status", savedStatus);
      card.classList.add(`status-${savedStatus}`);

      const actionButtons = card.querySelector(".order-actions");
      if (actionButtons && savedStatus !== "pending") {
        actionButtons.style.display = "none";
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

  function updateCalendarIndicators() {
    document
      .querySelectorAll(".calendar-date.has-event")
      .forEach((dateElem) => {
        const dateValue = dateElem.getAttribute("data-date");
        const status = calendarData.events[dateValue]?.status || "pending";

        dateElem.classList.remove(
          "status-pending",
          "status-finished",
          "status-cancelled"
        );
        dateElem.classList.add(`status-${status}`);

        const indicator = dateElem.querySelector(".event-indicator");
        if (indicator) {
          indicator.classList.remove(
            "status-pending",
            "status-finished",
            "status-cancelled"
          );
          indicator.classList.add(`status-${status}`);
        }
      });
  }
  function updateOrderInfo(date) {
    const schedule = scheduleData[date];
    if (!schedule) return;

    updateOrderCard(document.getElementById("order-card-1"), schedule, date);

    const partnerSchedule = partnerScheduleData[date];
    if (partnerSchedule) {
      const partnerId = date + "-partner";
      updateOrderCard(
        document.getElementById("order-card-2"),
        partnerSchedule,
        partnerId
      );
    }

    updateMainProgressBar(date);
  }

  function updateOrderCard(cardElement, scheduleData, orderId) {
    if (!cardElement) return;

    cardElement.setAttribute("data-id", orderId);
    const savedStatus =
      localStorage.getItem(`order_${orderId}_status`) ||
      (orderId.includes("-partner") &&
        !localStorage.getItem(`order_${orderId}_status`))
        ? localStorage.getItem(`order_${orderId.split("-")[0]}_status`) ||
          "pending"
        : "pending";

    cardElement.setAttribute("data-status", savedStatus);
    cardElement.classList.remove(
      "status-pending",
      "status-finished",
      "status-cancelled"
    );
    cardElement.classList.add(`status-${savedStatus}`);

    const clientNameElement = cardElement.querySelector(".order-header h4");
    if (clientNameElement) {
      clientNameElement.textContent = scheduleData.clientName;
    }

    const dateElement = cardElement.querySelector(".order-date");
    if (dateElement) {
      dateElement.textContent = scheduleData.date;
    }

    const priceElement = cardElement.querySelector(".order-amount");
    if (priceElement) {
      priceElement.textContent = scheduleData.price;
    }

    const timeSlotElement = cardElement.querySelector(".time-slot");
    if (timeSlotElement) {
      timeSlotElement.textContent = scheduleData.time;
    }

    const actionButtons = cardElement.querySelector(".order-actions");
    if (actionButtons) {
      if (savedStatus !== "pending") {
        actionButtons.style.display = "none";
      } else {
        actionButtons.style.display = "flex";

        const finishBtn = actionButtons.querySelector(".btn-finish");
        if (finishBtn) {
          finishBtn.onclick = function () {
            saveOrderStatus(orderId, "finished");
          };
        }

        const cancelBtn = actionButtons.querySelector(".btn-cancel");
        if (cancelBtn) {
          cancelBtn.onclick = function () {
            saveOrderStatus(orderId, "cancelled");
          };
        }
      }
    }
  }

  function updateMainProgressBar(date) {
    const progressContainer = document.querySelector(
      ".main-progress-container"
    );
    if (!progressContainer) return;

    let progressPercent = 25;

    if (date === "2025-05-03") progressPercent = 15;
    else if (date === "2025-05-10") progressPercent = 35;
    else if (date === "2025-05-12") progressPercent = 55;
    else if (date === "2025-05-15") progressPercent = 75;
    else if (date === "2025-05-22") progressPercent = 90;

    const progressBar = progressContainer.querySelector(".main-progress-bar");
    const progressText = progressContainer.querySelector(".main-progress-text");

    if (progressBar && progressText) {
      progressBar.style.width = `${progressPercent}%`;
      progressText.textContent = `${progressPercent}% Complete`;
    }
  }

  function updateOrderCard(cardElement, scheduleData, orderId) {
    if (!cardElement) return;

    cardElement.setAttribute("data-id", orderId);
    const savedStatus =
      localStorage.getItem(`order_${orderId}_status`) || "pending";

    cardElement.setAttribute("data-status", savedStatus);
    cardElement.classList.remove(
      "status-pending",
      "status-finished",
      "status-cancelled"
    );
    cardElement.classList.add(`status-${savedStatus}`);

    const clientNameElement = cardElement.querySelector(".order-header h4");
    if (clientNameElement) {
      clientNameElement.textContent = scheduleData.clientName;
    }

    const dateElement = cardElement.querySelector(".order-date");
    if (dateElement) {
      dateElement.textContent = scheduleData.date;
    }

    const priceElement = cardElement.querySelector(".order-amount");
    if (priceElement) {
      priceElement.textContent = scheduleData.price;
    }

    const timeSlotElement = cardElement.querySelector(".time-slot");
    if (timeSlotElement) {
      timeSlotElement.textContent = scheduleData.time;
    }

    const actionButtons = cardElement.querySelector(".order-actions");
    if (actionButtons) {
      if (savedStatus !== "pending") {
        actionButtons.style.display = "none";
      } else {
        actionButtons.style.display = "flex";

        const finishBtn = actionButtons.querySelector(".btn-finish");
        if (finishBtn) {
          finishBtn.onclick = function () {
            saveOrderStatus(orderId, "finished");
          };
        }

        const cancelBtn = actionButtons.querySelector(".btn-cancel");
        if (cancelBtn) {
          cancelBtn.onclick = function () {
            saveOrderStatus(orderId, "cancelled");
          };
        }
      }
    }
  }

  function setupCalendarListeners() {
    document.querySelectorAll(".calendar-date").forEach((dateCell) => {
      dateCell.addEventListener("click", function () {
        const date = this.getAttribute("data-date");

        document.querySelectorAll(".calendar-date").forEach((cell) => {
          cell.classList.remove("selected-date");
        });

        this.classList.add("selected-date");
        calendarData.selectedDate = date;

        if (calendarData.events[date]?.hasEvent) {
          updateOrderInfo(date);
        }
      });
    });

    const prevMonthBtn = document.querySelector(".prev-month");
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener("click", function () {
        if (calendarData.currentMonth > 3) {
          calendarData.currentMonth--;
          generateCalendar();
        }
      });
    }

    const nextMonthBtn = document.querySelector(".next-month");
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener("click", function () {
        if (calendarData.currentMonth < 5) {
          calendarData.currentMonth++;
          generateCalendar();
        }
      });
    }
  }

  function generateCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    if (!calendarContainer) return;

    const firstDay = new Date(
      calendarData.currentYear,
      calendarData.currentMonth,
      1
    );
    const lastDay = new Date(
      calendarData.currentYear,
      calendarData.currentMonth + 1,
      0
    );
    const daysInMonth = lastDay.getDate();
    const startDayIndex = firstDay.getDay();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonthName = monthNames[calendarData.currentMonth];

    let calendarHTML = `
          <div class="calendar-header">
            <button class="prev-month" ${
              calendarData.currentMonth === 3 ? "disabled" : ""
            }>❮</button>
            <h3>${currentMonthName} ${calendarData.currentYear}</h3>
            <button class="next-month" ${
              calendarData.currentMonth === 5 ? "disabled" : ""
            }>❯</button>
          </div>
          <div class="calendar-days">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div class="calendar-dates">`;

    const prevMonth =
      calendarData.currentMonth === 0 ? 11 : calendarData.currentMonth - 1;
    const prevYear =
      calendarData.currentMonth === 0
        ? calendarData.currentYear - 1
        : calendarData.currentYear;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    for (let i = 0; i < startDayIndex; i++) {
      const day = daysInPrevMonth - startDayIndex + i + 1;
      calendarHTML += `<div class="prev-month-date">${day}</div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${calendarData.currentYear}-${String(
        calendarData.currentMonth + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasEvent = calendarData.events[date]?.hasEvent;
      const eventStatus = calendarData.events[date]?.status || "pending";
      const isSelected =
        calendarData.selectedDate === date ? "selected-date" : "";

      calendarHTML += `
            <div class="calendar-date${hasEvent ? " has-event" : ""}${
        isSelected ? " selected-date" : ""
      } status-${eventStatus}" 
                data-date="${date}">
              ${day}
              ${
                hasEvent
                  ? `<span class="event-indicator status-${eventStatus}"></span>`
                  : ""
              }
            </div>`;
    }

    calendarHTML += `</div>`;
    calendarContainer.innerHTML = calendarHTML;

    setupCalendarListeners();

    if (!calendarData.selectedDate) {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${calendarData.currentYear}-${String(
          calendarData.currentMonth + 1
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (calendarData.events[date]?.hasEvent) {
          const dateCell = document.querySelector(
            `.calendar-date[data-date="${date}"]`
          );
          if (dateCell) {
            dateCell.classList.add("selected-date");
            calendarData.selectedDate = date;
            updateOrderInfo(date);
            break;
          }
        }
      }
    } else {
      updateOrderInfo(calendarData.selectedDate);
    }

    updateCalendarIndicators();
  }

  // Initialize order cards
  initializeOrderCards();
  setupCalendarListeners();
  updateCalendarIndicators();

  const selectedDate = document.querySelector(".calendar-date.selected-date");
  if (selectedDate) {
    const date = selectedDate.getAttribute("data-date");
    if (date) {
      updateOrderInfo(date);
    }
  }
});
