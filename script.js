/* =========================================
   AGRICRAFT CONNECT
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     NAVIGATION
  ========================= */

  const navLinks = document.querySelectorAll(".navbar nav a");

  navLinks.forEach(link => {

    link.addEventListener("click", function () {

      navLinks.forEach(item => {
        item.classList.remove("active");
      });

      this.classList.add("active");

    });

  });


  /* =========================
     CRAFT VIEW BUTTONS
  ========================= */

  const viewButtons = document.querySelectorAll(".craft-bottom button");

  viewButtons.forEach(button => {

    button.addEventListener("click", function () {

      const card = this.closest(".craft-card");

      const productName =
        card.querySelector("h3").textContent;

      const price =
        card.querySelector(".craft-bottom span").textContent;

      alert(
        "Product Details\n\n" +
        "Product: " + productName + "\n" +
        "Price: " + price + "\n\n" +
        "AI Match available for suitable buyers."
      );

    });

  });


  /* =========================
     SELL PRODUCT
  ========================= */

  window.startSelling = function () {

    const product = prompt(
      "What product would you like to sell?"
    );

    if (!product) {
      return;
    }

    const quantity = prompt(
      "Enter available quantity:"
    );

    if (!quantity) {
      return;
    }

    const price = prompt(
      "Enter your expected price:"
    );

    if (!price) {
      return;
    }

    alert(
      "AI Smart Catalog Created!\n\n" +
      "Product: " + product + "\n" +
      "Quantity: " + quantity + "\n" +
      "Expected Price: ₹" + price + "\n\n" +
      "✓ Product classified\n" +
      "✓ Description generated\n" +
      "✓ Buyer matching started"
    );

  };


  /* =========================
     BUYER SEARCH
  ========================= */

  const findProductsButton =
    document.querySelector('a[href="#buy"]');

  if (findProductsButton) {

    findProductsButton.addEventListener(
      "click",
      () => {

        setTimeout(() => {

          alert(
            "AI Buyer Matching\n\n" +
            "Tell us what product you need.\n\n" +
            "Example:\n" +
            "50 Cotton Handloom Sarees\n" +
            "Budget: ₹1,500 – ₹2,200\n" +
            "Location: Hyderabad"
          );

        }, 500);

      }
    );

  }


  /* =========================
     MY ORDERS
  ========================= */

  window.viewOrders = function () {

    const orders =
      JSON.parse(
        localStorage.getItem("agricraftOrders")
      ) || [];

    if (orders.length === 0) {

      alert(
        "No orders yet.\n\n" +
        "Your verified orders will appear here."
      );

      return;
    }

    let message = "MY ORDERS\n\n";

    orders.forEach((order, index) => {

      message +=
        (index + 1) +
        ". " +
        order.product +
        "\n" +
        "Quantity: " +
        order.quantity +
        "\n" +
        "Status: " +
        order.status +
        "\n\n";

    });

    alert(message);

  };


  /* =========================
     DEMO ORDER
  ========================= */

  function createDemoOrder() {

    const order = {

      product: "Handwoven Cotton Saree",

      quantity: "20 pieces",

      price: "₹2,000",

      status: "Verified",

      date: new Date().toLocaleDateString()

    };

    localStorage.setItem(
      "agricraftOrders",
      JSON.stringify([order])
    );

  }


  /* =========================
     AI VOICE DEMO
  ========================= */

  function startVoiceDemo() {

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {

      alert(
        "Voice input is not supported in this browser."
      );

      return;

    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.start();

    recognition.onstart = function () {

      alert(
        "🎙️ Listening...\n\n" +
        "Speak your product details."
      );

    };

    recognition.onresult = function (event) {

      const voiceText =
        event.results[0][0].transcript;

      alert(
        "Voice captured!\n\n" +
        "You said:\n" +
        voiceText +
        "\n\n✓ Speech converted to text\n" +
        "✓ AI catalog generation ready"
      );

    };

    recognition.onerror = function () {

      alert(
        "Voice input could not be captured."
      );

    };

  }


  /* =========================
     GLOBAL VOICE FUNCTION
  ========================= */

  window.startVoiceDemo = startVoiceDemo;


  /* =========================
     AI MATCH DEMO
  ========================= */

  window.showAIMatch = function () {

    alert(
      "🤖 AI Buyer–Seller Matching\n\n" +

      "Product: Cotton Handloom Saree\n" +

      "Buyer Requirement:\n" +
      "50 pieces\n" +
      "Budget: ₹1,500 – ₹2,200\n" +
      "Location: Hyderabad\n\n" +

      "Matching factors:\n" +
      "✓ Product\n" +
      "✓ Quantity\n" +
      "✓ Budget\n" +
      "✓ Location\n\n" +

      "Best suitable seller found."
    );

  };


  /* =========================
     REQUEST TO BUY
  ========================= */

  window.requestToBuy = function (
    productName = "Handwoven Cotton Saree"
  ) {

    const confirmRequest =
      confirm(
        "Request to Buy\n\n" +
        productName +
        "\n\n" +
        "Send this request to the seller?"
      );

    if (!confirmRequest) {
      return;
    }

    alert(
      "✓ Request Sent Successfully!\n\n" +
      "The seller can now Accept, Reject or Negotiate."
    );

    createDemoOrder();

  };


  /* =========================
     PAGE LOAD MESSAGE
  ========================= */

  console.log(
    "AgriCraft Connect loaded successfully."
  );

});
