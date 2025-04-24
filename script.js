document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Only run this if the form exists on the page
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual submission

      const name = document.getElementById("fullname")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const concert = document.getElementById("concert")?.value.trim();
      const payment = document.getElementById("payment-method")?.value.trim();
      const receipt = document.getElementById("receipt")?.files[0];

      if (!name || !email || !concert || !payment || !receipt) {
        alert("❗ Please fill in all fields and upload your receipt.");
        return;
      }

      alert("🎉 Booking successful! We’ve received your request.");
      form.reset(); // Reset the form after submission
    });
  }

  // 🎫 Handle "See Tickets" button clicks
  const eventElements = document.querySelectorAll(".event");

  eventElements.forEach(eventEl => {
    const button = eventEl.querySelector("button");
    const details = eventEl.querySelector(".details p")?.textContent.trim();
    const date = eventEl.querySelector(".date")?.innerText.trim();

    button?.addEventListener("click", () => {
      const queryString = new URLSearchParams({
        date: date,
        location: details
      }).toString();

      window.location.href = `seeticket.html?${queryString}`;
    });
  });

  // 🎟️ Handle ticket card clicks to open the booking modal
  document.querySelectorAll('.ticket-card').forEach(card => {
    card.addEventListener('click', function () {
      // Get ticket type text (fallback to 'General Admission')
      const type = card.querySelector('.type')?.textContent || 
                   card.querySelector('h4')?.textContent || 
                   'General Admission';
      document.getElementById('ticketType').textContent = type;

      // Show modal
      document.getElementById('bookingModal').style.display = 'block';
    });
  });

  // Close the modal when the close button is clicked
  document.querySelector('.close')?.addEventListener('click', function () {
    document.getElementById('bookingModal').style.display = 'none';
  });

  // Close modal on outside click
  window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // JS to show/hide USDT payment info based on the selected payment method
  document.getElementById('payment-method')?.addEventListener('change', function() {
    const usdtInfo = document.getElementById('usdt-info');
    if (this.value === 'usdt') {
      usdtInfo.style.display = 'block';
    } else {
      usdtInfo.style.display = 'none';
    }
  });

   // Add event listener to all ticket cards
   document.querySelectorAll('.ticket-card').forEach(card => {
    card.addEventListener('click', function () {
      const ticketType = card.querySelector('.type').textContent.trim() || 'General Admission';
      const ticketPrice = card.querySelector('.price').textContent.trim();

      // Redirect to the booking page with ticket type and price as query params
      window.location.href = `booking.html?ticketType=${encodeURIComponent(ticketType)}&ticketPrice=${encodeURIComponent(ticketPrice)}`;
    });
  });

  // Function to get query parameters from URL
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      ticketType: params.get('ticketType'),
      ticketPrice: params.get('ticketPrice')
    };
  }

  

  // Display ticket information based on query params
  window.onload = function() {
    const { ticketType, ticketPrice } = getQueryParams();
    document.getElementById('ticket-type').textContent = `Ticket Type: ${ticketType || 'Unknown'}`;
    document.getElementById('ticket-price').textContent = `Price: ${ticketPrice || 'Unknown'}`;
  };

  // script.js

const eventsPerPage = 6;
const allEvents = Array.from(document.querySelectorAll('.event'));
const pagination = document.querySelector('.pagination');

function showPage(page) {
  allEvents.forEach((event, index) => {
    event.style.display = (index >= (page - 1) * eventsPerPage && index < page * eventsPerPage) ? 'flex' : 'none';
  });
  updatePagination(page);
}

function updatePagination(activePage) {
  pagination.innerHTML = '';
  const pageCount = Math.ceil(allEvents.length / eventsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const pageBtn = document.createElement('span');
    pageBtn.textContent = i;
    pageBtn.className = i === activePage ? 'active' : '';
    pageBtn.addEventListener('click', () => showPage(i));
    pagination.appendChild(pageBtn);
  }
}

// Initially display first page
showPage(1);




});






  const ticketQuantity = document.getElementById('ticket-quantity');
  const totalCost = document.getElementById('total-cost');
  const ticketPrice = 50;

  function updateTotal() {
    const quantity = parseInt(ticketQuantity.value, 10);
    const total = quantity * ticketPrice;
    totalCost.textContent = `Total: $${total}`;
  }

  // Initialize and listen to changes
  ticketQuantity.addEventListener('change', updateTotal);
  updateTotal(); // run on page load

document.addEventListener('DOMContentLoaded', () => {
  const ticketType = document.getElementById('ticket-type');
  const ticketQuantity = document.getElementById('ticket-quantity');
  const selectedTypeText = document.getElementById('selected-type');
  const selectedQtyText = document.getElementById('selected-quantity');
  const totalPriceText = document.getElementById('total-price');

  const prices = {
    standard: 50,
    vip: 100,
    backstage: 200
  };

  function updateSummary() {
    const type = ticketType.value;
    const quantity = parseInt(ticketQuantity.value, 10);
    const price = prices[type];
    const total = quantity * price;

    selectedTypeText.textContent = `Ticket Type: ${type.charAt(0).toUpperCase() + type.slice(1)} ($${price})`;
    selectedQtyText.textContent = `Quantity: ${quantity}`;
    totalPriceText.textContent = `Total Price: $${total}`;
  }

  ticketType.addEventListener('change', updateSummary);
  ticketQuantity.addEventListener('change', updateSummary);

  // Initialize on load
  updateSummary();
});
document.addEventListener("DOMContentLoaded", () => {
  const selectedTickets = [];

  document.querySelectorAll(".ticket-card").forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      const price = card.dataset.price;

      // Toggle selection
      if (card.classList.contains("selected")) {
        card.classList.remove("selected");
        const index = selectedTickets.findIndex(t => t.type === type && t.price === price);
        if (index > -1) selectedTickets.splice(index, 1);
      } else {
        card.classList.add("selected");
        selectedTickets.push({ type, price });
      }
    });
  });

  document.getElementById("proceed-booking").addEventListener("click", () => {
    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    // Store in localStorage and redirect
    localStorage.setItem("selectedTickets", JSON.stringify(selectedTickets));
    window.location.href = "booking.html";
  });
});







// document.addEventListener("DOMContentLoaded", () => {
//   // 🔒 Only run this if the form exists on the page
//   const form = document.querySelector("form");

//   if (form) {
//     form.addEventListener("submit", function (e) {
//       e.preventDefault(); // Prevent actual submission

//       const name = document.getElementById("fullname")?.value.trim();
//       const email = document.getElementById("email")?.value.trim();
//       const concert = document.getElementById("concert")?.value.trim();
//       const payment = document.getElementById("payment")?.value.trim();
//       const receipt = document.getElementById("receipt")?.files[0];

//       if (!name || !email || !concert || !payment || !receipt) {
//         alert("❗ Please fill in all fields and upload your receipt.");
//         return;
//       }

//       alert("🎉 Booking successful! We’ve received your request.");
//       form.reset();
//     });
//   }

//   // 🎫 Handle "See Tickets" button clicks
//   const eventElements = document.querySelectorAll(".event");

//   eventElements.forEach(eventEl => {
//     const button = eventEl.querySelector("button");
//     const details = eventEl.querySelector(".details p")?.textContent.trim();
//     const date = eventEl.querySelector(".date")?.innerText.trim();

//     button?.addEventListener("click", () => {
//       const queryString = new URLSearchParams({
//         date: date,
//         location: details
//       }).toString();

//       window.location.href = `seeticket.html?${queryString}`;
//     });


    
//   document.querySelectorAll('.ticket-card').forEach(card => {
//     card.addEventListener('click', function () {
//       // Get ticket type text (fallback to 'General Admission')
//       const type = card.querySelector('.type')?.textContent || 
//                    card.querySelector('h4')?.textContent || 
//                    'General Admission';
//       document.getElementById('ticketType').textContent = type;

//       // Show modal
//       document.getElementById('bookingModal').style.display = 'block';
//     });
//   });

//   // Close the modal
//   document.querySelector('.close').addEventListener('click', function () {
//     document.getElementById('bookingModal').style.display = 'none';
//   });

//   // Close modal on outside click
//   window.onclick = function(event) {
//     const modal = document.getElementById('bookingModal');
//     if (event.target === modal) {
//       modal.style.display = 'none';
//     }
//   };


//   });
// });
