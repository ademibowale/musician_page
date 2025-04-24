document.addEventListener("DOMContentLoaded", () => {
  // 🎟️ FORM VALIDATION
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      const name = document.getElementById("fullname")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const concert = document.getElementById("concert")?.value.trim();
      const payment = document.getElementById("payment-method")?.value.trim();
      const receiptInput = document.getElementById("receipt");
      const receipt = receiptInput?.files?.[0];

      if (!name || !email || !concert || !payment || !receipt) {
        e.preventDefault();
        alert("❗ Please fill in all fields and upload your receipt.");
      } else {
        alert("🎉 Booking successful! Submitting form...");
      }
    });
  }

  // 📋 COPY USDT ADDRESS
  const copyAddress = () => {
    const addressEl = document.getElementById("usdt-address");
    const msgSpan = document.getElementById("copy-msg");

    if (!addressEl || !msgSpan) return;

    const address = addressEl.innerText.trim();
    if (!address) return;

    navigator.clipboard.writeText(address).then(() => {
      msgSpan.textContent = "Copied!";
      msgSpan.style.opacity = "1";
      setTimeout(() => {
        msgSpan.textContent = "";
        msgSpan.style.opacity = "0";
      }, 2000);
    }).catch(() => {
      msgSpan.textContent = "Copy failed";
      msgSpan.style.color = "red";
      setTimeout(() => {
        msgSpan.textContent = "";
        msgSpan.style.color = "";
      }, 2000);
    });
  };
  window.copyAddress = copyAddress;

  // 🎫 SEE TICKETS BUTTON HANDLING
  document.querySelectorAll(".event").forEach(eventEl => {
    const button = eventEl.querySelector("button");
    const location = eventEl.querySelector(".details p")?.textContent?.trim() ?? "";
    const date = eventEl.querySelector(".date")?.innerText?.trim() ?? "";

    button?.addEventListener("click", () => {
      const query = new URLSearchParams({ date, location }).toString();
      window.location.href = `seeticket.html?${query}`;
    });
  });

  // 🎟️ TICKET CARD CLICK HANDLING
  document.querySelectorAll(".ticket-card").forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type || card.querySelector(".type")?.textContent?.trim() || "General Admission";
      const price = card.dataset.price || card.querySelector(".price")?.textContent?.trim() || "0";

      localStorage.setItem("selectedTickets", JSON.stringify([{ type, price }]));
      window.location.href = `booking.html?ticketType=${encodeURIComponent(type)}&ticketPrice=${encodeURIComponent(price)}`;
    });
  });

  // 🧾 DISPLAY TICKET INFO IN BOOKING PAGE
  const showTicketInfo = () => {
    const params = new URLSearchParams(window.location.search);
    const ticketType = params.get("ticketType") || "Unknown";
    const ticketPrice = params.get("ticketPrice") || "Unknown";

    const typeEl = document.getElementById("ticket-type");
    const priceEl = document.getElementById("ticket-price");

    if (typeEl) typeEl.textContent = `Ticket Type: ${ticketType}`;
    if (priceEl) priceEl.textContent = `Price: ${ticketPrice}`;
  };
  showTicketInfo();

  // 🧾 TOTAL COST BASED ON QUANTITY
  const ticketQuantityInput = document.getElementById("ticket-quantity");
  const totalCostDisplay = document.getElementById("total-cost");
  const priceMap = { standard: 50, vip: 100, backstage: 200 };

  const updateTotal = () => {
    const quantity = parseInt(ticketQuantityInput?.value || "0", 10);
    const type = document.getElementById("ticket-type-selector")?.value?.toLowerCase() || "standard";
    const unitPrice = priceMap[type] || 50;
    const total = quantity * unitPrice;

    if (totalCostDisplay) totalCostDisplay.textContent = `Total: $${total}`;

    const selectedTypeText = document.getElementById("selected-type");
    const selectedQtyText = document.getElementById("selected-quantity");
    const totalPriceText = document.getElementById("total-price");

    if (selectedTypeText) selectedTypeText.textContent = `Ticket Type: ${type} ($${unitPrice})`;
    if (selectedQtyText) selectedQtyText.textContent = `Quantity: ${quantity}`;
    if (totalPriceText) totalPriceText.textContent = `Total Price: $${total}`;
  };

  ticketQuantityInput?.addEventListener("change", updateTotal);
  document.getElementById("ticket-type-selector")?.addEventListener("change", updateTotal);
  updateTotal();

  // 🏷️ PAYMENT METHOD TOGGLE
  const paymentMethodSelector = document.getElementById("payment-method");
  const usdtInfo = document.getElementById("usdt-info");

  if (paymentMethodSelector && usdtInfo) {
    paymentMethodSelector.addEventListener("change", function () {
      usdtInfo.style.display = this.value === "usdt" ? "block" : "none";
    });
  }

  // ❌ MODAL CONTROL
  const bookingModal = document.getElementById("bookingModal");
  document.querySelector(".close")?.addEventListener("click", () => {
    if (bookingModal) bookingModal.style.display = "none";
  });

  window.onclick = function (e) {
    if (e.target === bookingModal) {
      bookingModal.style.display = "none";
    }
  };

  // 📄 PAGINATION
  const eventsPerPage = 6;
  const allEvents = Array.from(document.querySelectorAll(".event"));
  const pagination = document.querySelector(".pagination");

  function showPage(page) {
    allEvents.forEach((event, index) => {
      event.style.display = (index >= (page - 1) * eventsPerPage && index < page * eventsPerPage) ? "flex" : "none";
    });
    updatePagination(page);
  }

  function updatePagination(activePage) {
    if (!pagination) return;
    pagination.innerHTML = "";
    const totalPages = Math.ceil(allEvents.length / eventsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("span");
      pageBtn.textContent = i;
      if (i === activePage) pageBtn.classList.add("active");
      pageBtn.addEventListener("click", () => showPage(i));
      pagination.appendChild(pageBtn);
    }
  }

  showPage(1);
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      const name = document.getElementById("fullname")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const concert = document.getElementById("concert")?.value.trim();
      const payment = document.getElementById("payment-method")?.value.trim();
      const receipt = document.getElementById("receipt")?.files[0];

      if (!name || !email || !concert || !payment || !receipt) {
        e.preventDefault();
        alert("❗ Please fill in all fields and upload your receipt.");
      } else {
        alert("🎉 Booking successful! Generating your ticket...");

        // Generate unique ticket ID
        const ticketId = "TICKET-" + Math.floor(Math.random() * 1000000);

        // Automatically trigger ticket download
        const selected = JSON.parse(localStorage.getItem("selectedTickets"))?.[0] || {};
const ticketType = selected.type || "Unknown";
const ticketPrice = selected.price || "Unknown";

const ticketData = {
  ticketId,
  name,
  email,
  concert,
  payment,
  ticketType,
  ticketPrice,
};


        generatePDFTicket(ticketData);

        // Allow the form to submit after the download
        setTimeout(() => {
          form.submit();
        }, 2000); // Adjust time as necessary
      }
    });
  }

  // Function to generate PDF ticket
  const generatePDFTicket = (ticketData) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add ticket content to PDF
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("🎟️ Concert Ticket", 20, 20);

    // Ticket Information
    doc.setFontSize(14);
    doc.text(`Ticket ID: ${ticketData.ticketId}`, 20, 40);
    doc.text(`Name: ${ticketData.name}`, 20, 50);
    doc.text(`Email: ${ticketData.email}`, 20, 60);
    doc.text(`Concert: ${ticketData.concert}`, 20, 70);
    doc.text(`Payment Method: ${ticketData.payment}`, 20, 80);
    doc.text(`Ticket Type: ${ticketData.ticketType}`, 20, 90);
    doc.text(`Ticket Price: $${ticketData.ticketPrice}`, 20, 100);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for booking your ticket with us!", 20, 120);
    doc.text("Enjoy the concert!", 20, 130);

    // Save the ticket as PDF
    doc.save(`${ticketData.name}-ticket.pdf`);
  };
});

