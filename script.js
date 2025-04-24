document.addEventListener("DOMContentLoaded", () => {
  // 🎟️ FORM VALIDATION & TICKET DOWNLOAD
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
        e.preventDefault(); // prevent default submission to generate ticket first
        alert("🎉 Booking successful! Generating your ticket...");

        const ticketId = "TICKET-" + Math.floor(100000 + Math.random() * 900000);
        const selected = JSON.parse(localStorage.getItem("selectedTickets"))?.[0] || {};
        const ticketType = selected.type || "General Admission";
        const ticketPrice = selected.price || "0";

        const ticketData = { ticketId, name, email, concert, payment, ticketType, ticketPrice };

        generatePDFTicket(ticketData);

        setTimeout(() => {
          form.submit();
        }, 2000);
      }
    });
  }

  // 🎫 PDF TICKET GENERATOR
  function generatePDFTicket(ticketData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape", "mm", "a5");

    // Layout Colors
    const bgColor = "#fdf6e3";
    const titleColor = "#1a1a1a";
    const borderColor = "#333";
    const labelColor = "#777";
    const valueColor = "#000";
    const accentColor = "#e74c3c";

    // Ticket Background
    doc.setFillColor(bgColor);
    doc.rect(0, 0, 210, 148, "F");

    // Border
    doc.setDrawColor(borderColor);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, 200, 138);

    // Header
    doc.setTextColor(titleColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("🎶JLO LIVE CONCERT TICKET", 105, 25, { align: "center" });

    // Divider
    doc.setDrawColor(labelColor);
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Ticket Info
    const leftX = 20;
    const rightX = 120;
    const yStart = 45;
    const lineHeight = 10;

    doc.setFontSize(12);
    doc.setTextColor(labelColor);
    doc.text("Ticket ID:", leftX, yStart);
    doc.text("Name:", leftX, yStart + lineHeight);
    doc.text("Email:", leftX, yStart + 2 * lineHeight);
    doc.text("Concert:", rightX, yStart);
    doc.text("Payment:", rightX, yStart + lineHeight);
    doc.text("Ticket Type:", rightX, yStart + 2 * lineHeight);
    doc.text("Price:", rightX, yStart + 3 * lineHeight);

    doc.setTextColor(valueColor);
    doc.setFont("helvetica", "normal");
    doc.text(ticketData.ticketId, leftX + 35, yStart);
    doc.text(ticketData.name, leftX + 35, yStart + lineHeight);
    doc.text(ticketData.email, leftX + 35, yStart + 2 * lineHeight);
    doc.text(ticketData.concert, rightX + 35, yStart);
    doc.text(ticketData.payment, rightX + 35, yStart + lineHeight);
    doc.text(ticketData.ticketType, rightX + 35, yStart + 2 * lineHeight);
    doc.text(`$${ticketData.ticketPrice}`, rightX + 35, yStart + 3 * lineHeight);

    // Footer
    doc.setFontSize(11);
    doc.setTextColor(accentColor);
    doc.text("🎫 Present this ticket at the venue entrance", 105, 125, { align: "center" });
    doc.text("Thank you & enjoy the show!", 105, 135, { align: "center" });

    doc.save(`${ticketData.name}-concert-ticket.pdf`);
  }

  // 📋 COPY USDT ADDRESS
  const copyAddress = () => {
    const addressEl = document.getElementById("usdt-address");
    const msgSpan = document.getElementById("copy-msg");
    if (!addressEl || !msgSpan) return;

    navigator.clipboard.writeText(addressEl.innerText.trim())
      .then(() => {
        msgSpan.textContent = "Copied!";
        msgSpan.style.opacity = "1";
        setTimeout(() => msgSpan.style.opacity = "0", 2000);
      })
      .catch(() => {
        msgSpan.textContent = "Copy failed";
        msgSpan.style.color = "red";
        setTimeout(() => {
          msgSpan.textContent = "";
          msgSpan.style.color = "";
        }, 2000);
      });
  };
  window.copyAddress = copyAddress;

  // 🎫 SEE TICKETS NAVIGATION
  document.querySelectorAll(".event").forEach(eventEl => {
    const button = eventEl.querySelector("button");
    const location = eventEl.querySelector(".details p")?.textContent?.trim() ?? "";
    const date = eventEl.querySelector(".date")?.innerText?.trim() ?? "";

    button?.addEventListener("click", () => {
      const query = new URLSearchParams({ date, location }).toString();
      window.location.href = `seeticket.html?${query}`;
    });
  });

  // 🎟️ TICKET CARD CLICK
  document.querySelectorAll(".ticket-card").forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type || card.querySelector(".type")?.textContent?.trim() || "General Admission";
      const price = card.dataset.price || card.querySelector(".price")?.textContent?.trim() || "0";
      localStorage.setItem("selectedTickets", JSON.stringify([{ type, price }]));
      window.location.href = `booking.html?ticketType=${encodeURIComponent(type)}&ticketPrice=${encodeURIComponent(price)}`;
    });
  });

  // 🧾 DISPLAY SELECTED TICKET
  const showTicketInfo = () => {
    const params = new URLSearchParams(window.location.search);
    document.getElementById("ticket-type").textContent = `Ticket Type: ${params.get("ticketType") || "Unknown"}`;
    document.getElementById("ticket-price").textContent = `Price: ${params.get("ticketPrice") || "Unknown"}`;
  };
  showTicketInfo();

  // 💵 UPDATE TOTAL PRICE
  const priceMap = { standard: 50, vip: 100, backstage: 200 };
  const updateTotal = () => {
    const quantity = parseInt(document.getElementById("ticket-quantity")?.value || "0", 10);
    const type = document.getElementById("ticket-type-selector")?.value?.toLowerCase() || "standard";
    const unitPrice = priceMap[type] || 50;
    const total = quantity * unitPrice;

    document.getElementById("total-cost").textContent = `Total: $${total}`;
    document.getElementById("selected-type").textContent = `Ticket Type: ${type} ($${unitPrice})`;
    document.getElementById("selected-quantity").textContent = `Quantity: ${quantity}`;
    document.getElementById("total-price").textContent = `Total Price: $${total}`;
  };
  document.getElementById("ticket-quantity")?.addEventListener("change", updateTotal);
  document.getElementById("ticket-type-selector")?.addEventListener("change", updateTotal);
  updateTotal();

  // 💳 PAYMENT METHOD TOGGLE
  const paymentMethodSelector = document.getElementById("payment-method");
  const usdtInfo = document.getElementById("usdt-info");
  paymentMethodSelector?.addEventListener("change", function () {
    usdtInfo.style.display = this.value === "usdt" ? "block" : "none";
  });

  // ❌ MODAL HANDLING
  const bookingModal = document.getElementById("bookingModal");
  document.querySelector(".close")?.addEventListener("click", () => {
    bookingModal.style.display = "none";
  });
  window.onclick = function (e) {
    if (e.target === bookingModal) bookingModal.style.display = "none";
  };

  // 📄 PAGINATION
  const eventsPerPage = 6;
  const allEvents = Array.from(document.querySelectorAll(".event"));
  const pagination = document.querySelector(".pagination");

  const showPage = (page) => {
    allEvents.forEach((event, index) => {
      event.style.display = (index >= (page - 1) * eventsPerPage && index < page * eventsPerPage) ? "flex" : "none";
    });
    updatePagination(page);
  };

  const updatePagination = (activePage) => {
    if (!pagination) return;
    pagination.innerHTML = "";
    const totalPages = Math.ceil(allEvents.length / eventsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const span = document.createElement("span");
      span.textContent = i;
      if (i === activePage) span.classList.add("active");
      span.addEventListener("click", () => showPage(i));
      pagination.appendChild(span);
    }
  };

  showPage(1);
});
