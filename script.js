/* =====================================================
   AGRICRAFT - COMPLETE SCRIPT.JS
   Buyer / Seller / Voice / Language / Tickets / Tracking
===================================================== */


/* =====================================================
   GLOBAL LANGUAGE SETTINGS
===================================================== */

let selectedLanguage =
  localStorage.getItem("agriCraftLanguage") || "en-IN";


const translations = {
  "en-IN": {
    home: "Home",
    buyer: "Buyer",
    seller: "Seller",
    bookTickets: "Book Tickets",
    myTickets: "My Tickets",
    trackOrder: "Track Order",
    speak: "Speak",
    submit: "Submit",
    noTickets: "No tickets booked yet",
    bookingConfirmed: "Booking Confirmed",
    ticketGenerated: "Ticket Generated",
    eventUpcoming: "Event Upcoming",
    eventCompleted: "Event Completed",
    orderNotFound: "Order not found"
  },

  "te-IN": {
    home: "హోమ్",
    buyer: "కొనుగోలుదారు",
    seller: "విక్రేత",
    bookTickets: "టికెట్లు బుక్ చేయండి",
    myTickets: "నా టికెట్లు",
    trackOrder: "ఆర్డర్ ట్రాక్ చేయండి",
    speak: "మాట్లాడండి",
    submit: "సమర్పించండి",
    noTickets: "ఇంకా టికెట్లు బుక్ చేయలేదు",
    bookingConfirmed: "బుకింగ్ నిర్ధారించబడింది",
    ticketGenerated: "టికెట్ రూపొందించబడింది",
    eventUpcoming: "ఈవెంట్ త్వరలో ఉంది",
    eventCompleted: "ఈవెంట్ పూర్తయింది",
    orderNotFound: "ఆర్డర్ కనుగొనబడలేదు"
  },

  "hi-IN": {
    home: "होम",
    buyer: "खरीदार",
    seller: "विक्रेता",
    bookTickets: "टिकट बुक करें",
    myTickets: "मेरे टिकट",
    trackOrder: "ऑर्डर ट्रैक करें",
    speak: "बोलें",
    submit: "सबमिट करें",
    noTickets: "अभी तक कोई टिकट बुक नहीं किया गया",
    bookingConfirmed: "बुकिंग की पुष्टि हो गई",
    ticketGenerated: "टिकट बनाया गया",
    eventUpcoming: "कार्यक्रम जल्द आने वाला है",
    eventCompleted: "कार्यक्रम पूरा हो गया",
    orderNotFound: "ऑर्डर नहीं मिला"
  },

  "ta-IN": {
    home: "முகப்பு",
    buyer: "வாங்குபவர்",
    seller: "விற்பவர்",
    bookTickets: "டிக்கெட் பதிவு",
    myTickets: "என் டிக்கெட்டுகள்",
    trackOrder: "ஆர்டரை கண்காணிக்க",
    speak: "பேசவும்",
    submit: "சமர்ப்பிக்கவும்",
    noTickets: "இன்னும் டிக்கெட்டுகள் பதிவு செய்யப்படவில்லை",
    bookingConfirmed: "பதிவு உறுதி செய்யப்பட்டது",
    ticketGenerated: "டிக்கெட் உருவாக்கப்பட்டது",
    eventUpcoming: "நிகழ்வு விரைவில் உள்ளது",
    eventCompleted: "நிகழ்வு முடிந்தது",
    orderNotFound: "ஆர்டர் கிடைக்கவில்லை"
  },

  "kn-IN": {
    home: "ಮುಖಪುಟ",
    buyer: "ಖರೀದಿದಾರ",
    seller: "ಮಾರಾಟಗಾರ",
    bookTickets: "ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ",
    myTickets: "ನನ್ನ ಟಿಕೆಟ್‌ಗಳು",
    trackOrder: "ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    speak: "ಮಾತನಾಡಿ",
    submit: "ಸಲ್ಲಿಸಿ",
    noTickets: "ಇನ್ನೂ ಯಾವುದೇ ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿಲ್ಲ",
    bookingConfirmed: "ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    ticketGenerated: "ಟಿಕೆಟ್ ರಚಿಸಲಾಗಿದೆ",
    eventUpcoming: "ಈವೆಂಟ್ ಶೀಘ್ರದಲ್ಲೇ ಇದೆ",
    eventCompleted: "ಈವೆಂಟ್ ಮುಗಿದಿದೆ",
    orderNotFound: "ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ"
  }
};


/* =====================================================
   HELPER FUNCTION
===================================================== */

function getText(key) {
  const languageData =
    translations[selectedLanguage] || translations["en-IN"];

  return languageData[key] || translations["en-IN"][key] || key;
}


/* =====================================================
   BUYER AND SELLER PANELS
===================================================== */

function openBuyerPanel() {
  const buyerPanel = document.getElementById("buyerPanel");
  const sellerPanel = document.getElementById("sellerPanel");

  if (buyerPanel) {
    buyerPanel.classList.add("active");
    buyerPanel.style.display = "block";
  }

  if (sellerPanel) {
    sellerPanel.classList.remove("active");
    sellerPanel.style.display = "none";
  }
}


function openSellerPanel() {
  const buyerPanel = document.getElementById("buyerPanel");
  const sellerPanel = document.getElementById("sellerPanel");

  if (sellerPanel) {
    sellerPanel.classList.add("active");
    sellerPanel.style.display = "block";
  }

  if (buyerPanel) {
    buyerPanel.classList.remove("active");
    buyerPanel.style.display = "none";
  }
}


/* Alternative function names, if your HTML uses these */

function showBuyerPanel() {
  openBuyerPanel();
}

function showSellerPanel() {
  openSellerPanel();
}


/* =====================================================
   VOICE RECOGNITION
===================================================== */

function createVoiceRecognition(onResult, onEnd) {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
    );
    return null;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = selectedLanguage || "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = function () {
    console.log("Voice recognition started");
  };

  recognition.onresult = function (event) {
    const spokenText =
      event.results[0][0].transcript;

    console.log("Recognized text:", spokenText);

    if (typeof onResult === "function") {
      onResult(spokenText);
    }
  };

  recognition.onerror = function (event) {
    console.error("Voice recognition error:", event.error);

    if (event.error === "not-allowed") {
      alert(
        "Microphone permission denied. Please allow microphone access."
      );
    } else if (event.error === "no-speech") {
      alert("Voice not detected. Please speak again.");
    } else if (event.error === "audio-capture") {
      alert("Microphone not found. Please check your microphone.");
    } else {
      alert("Voice recognition failed. Please try again.");
    }
  };

  recognition.onend = function () {
    console.log("Voice recognition ended");

    if (typeof onEnd === "function") {
      onEnd();
    }
  };

  return recognition;
}


/* Seller voice */

function startSellerVoice(buttonElement) {
  const sellerInput =
    document.getElementById("sellerInput");

  const recognition = createVoiceRecognition(function (text) {
    if (sellerInput) {
      sellerInput.value = text;
    }
  });

  if (recognition) {
    recognition.start();
  }
}


/* Buyer voice */

function startBuyerVoice(buttonElement) {
  const buyerInput =
    document.getElementById("buyerInput");

  const recognition = createVoiceRecognition(function (text) {
    if (buyerInput) {
      buyerInput.value = text;
    }
  });

  if (recognition) {
    recognition.start();
  }
}


/* =====================================================
   LANGUAGE CHANGE
===================================================== */

function changeLanguage() {
  const languageSelect =
    document.getElementById("languageSelect");

  if (!languageSelect) {
    return;
  }

  selectedLanguage = languageSelect.value;

  localStorage.setItem(
    "agriCraftLanguage",
    selectedLanguage
  );

  const languageData =
    translations[selectedLanguage] ||
    translations["en-IN"];

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.getAttribute("data-i18n");

    if (languageData[key]) {
      element.textContent = languageData[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
    const key = element.getAttribute("data-i18n-placeholder");

    if (languageData[key]) {
      element.placeholder = languageData[key];
    }
  });

  console.log("Language changed to:", selectedLanguage);
}


/* =====================================================
   BOOKING DATA SAVE
===================================================== */

function saveBooking(bookingData) {
  const existingBookings =
    JSON.parse(localStorage.getItem("myBookings")) || [];

  existingBookings.push(bookingData);

  localStorage.setItem(
    "myBookings",
    JSON.stringify(existingBookings)
  );

  console.log("Booking saved:", bookingData);
}


/* =====================================================
   GET FORM VALUE HELPER
===================================================== */

function getElementValue(id, defaultValue = "") {
  const element = document.getElementById(id);

  if (!element) {
    return defaultValue;
  }

  return element.value || element.textContent || defaultValue;
}


/* =====================================================
   BOOKING CONFIRMATION
===================================================== */

function confirmBooking() {
  const eventName =
    getElementValue("eventName", "Selected Event");

  const customerName =
    getElementValue("customerName", "Customer");

  const quantity =
    getElementValue("ticketQuantity", "1");

  const totalAmount =
    getElementValue("totalAmount", "₹0");

  const bookingData = {
    id: "ORD-" + Date.now(),
    eventName: eventName,
    customerName: customerName,
    quantity: quantity,
    totalAmount: totalAmount,
    status: "Confirmed",
    bookedAt: new Date().toLocaleString()
  };

  saveBooking(bookingData);

  localStorage.setItem(
    "latestBooking",
    JSON.stringify(bookingData)
  );

  alert(getText("bookingConfirmed"));

  window.location.href = "confirmation.html";
}


/* =====================================================
   DISPLAY MY TICKETS
===================================================== */

function showMyTickets() {
  const container =
    document.getElementById("myTicketsContainer");

  if (!container) {
    return;
  }

  const bookings =
    JSON.parse(localStorage.getItem("myBookings")) || [];

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-ticket">
        <h3>${getText("noTickets")}</h3>
        <p>Your booked tickets will appear here.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = bookings
    .map(function (booking) {
      return `
        <div class="ticket-card">
          <h3>${booking.eventName}</h3>

          <p>
            <strong>Order ID:</strong>
            ${booking.id}
          </p>

          <p>
            <strong>Name:</strong>
            ${booking.customerName}
          </p>

          <p>
            <strong>Tickets:</strong>
            ${booking.quantity}
          </p>

          <p>
            <strong>Total:</strong>
            ${booking.totalAmount}
          </p>

          <p>
            <strong>Booked On:</strong>
            ${booking.bookedAt}
          </p>

          <p class="ticket-status">
            ${booking.status}
          </p>

          <button
            type="button"
            onclick="trackOrder('${booking.id}')">
            ${getText("trackOrder")}
          </button>
        </div>
      `;
    })
    .join("");
}


/* =====================================================
   ORDER TRACKING
===================================================== */

function trackOrder(orderId) {
  const bookings =
    JSON.parse(localStorage.getItem("myBookings")) || [];

  const booking = bookings.find(function (item) {
    return item.id === orderId;
  });

  const trackingResult =
    document.getElementById("trackingResult");

  if (!trackingResult) {
    return;
  }

  if (!booking) {
    trackingResult.innerHTML = `
      <p>${getText("orderNotFound")}</p>
    `;

    return;
  }

  trackingResult.innerHTML = `
    <div class="tracking-card">
      <h3>${getText("trackOrder")}</h3>

      <p>
        <strong>Order ID:</strong>
        ${booking.id}
      </p>

      <div class="tracking-step completed">
        <span>✓</span>
        <p>${getText("bookingConfirmed")}</p>
      </div>

      <div class="tracking-step active">
        <span>●</span>
        <p>${getText("ticketGenerated")}</p>
      </div>

      <div class="tracking-step">
        <span>○</span>
        <p>${getText("eventUpcoming")}</p>
      </div>

      <div class="tracking-step">
        <span>○</span>
        <p>${getText("eventCompleted")}</p>
      </div>
    </div>
  `;
}


/* =====================================================
   DISPLAY LATEST CONFIRMATION
===================================================== */

function showLatestBooking() {
  const booking =
    JSON.parse(localStorage.getItem("latestBooking"));

  if (!booking) {
    return;
  }

  const orderId =
    document.getElementById("confirmationOrderId");

  const confirmationEvent =
    document.getElementById("confirmationEvent");

  const confirmationName =
    document.getElementById("confirmationName");

  const confirmationAmount =
    document.getElementById("confirmationAmount");

  if (orderId) {
    orderId.textContent = booking.id;
  }

  if (confirmationEvent) {
    confirmationEvent.textContent = booking.eventName;
  }

  if (confirmationName) {
    confirmationName.textContent = booking.customerName;
  }

  if (confirmationAmount) {
    confirmationAmount.textContent = booking.totalAmount;
  }
}


/* =====================================================
   DOM CONTENT LOADED
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const languageSelect =
    document.getElementById("languageSelect");

  if (languageSelect) {
    languageSelect.value = selectedLanguage;

    languageSelect.addEventListener(
      "change",
      changeLanguage
    );
  }

  changeLanguage();
  showMyTickets();
  showLatestBooking();

  console.log("AgriCraft JavaScript loaded successfully");
});
     
