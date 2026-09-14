/* =====================================================
   AGRICRAFT CONNECT - COMPLETE SCRIPT
   Voice Recognition: English India (en-IN)
===================================================== */


/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  });
}


/* =========================
   PAGE NAVIGATION
========================= */

function goToSeller() {
  const sellerSection = document.getElementById("seller");

  if (sellerSection) {
    sellerSection.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function goToBuyer() {
  const buyerSection = document.getElementById("buyer");

  if (buyerSection) {
    buyerSection.scrollIntoView({
      behavior: "smooth"
    });
  }
}

function goToOrders() {
  const ordersSection = document.getElementById("orders");

  if (ordersSection) {
    ordersSection.scrollIntoView({
      behavior: "smooth"
    });
  }

  showOrderRequests();
}


/* =========================
   VOICE RECOGNITION HELPER
========================= */

function createVoiceRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Voice recognition is not supported in this browser. Please use Google Chrome."
    );
    return null;
  }

  const recognition = new SpeechRecognition();

  // English India voice recognition
  recognition.lang = "en-IN";

  // Stop after user finishes speaking
  recognition.continuous = false;

  // Show only final recognized text
  recognition.interimResults = false;

  // Best available result
  recognition.maxAlternatives = 1;

  return recognition;
}


/* =========================
   SELLER VOICE INPUT
========================= */

function startSellerVoice() {
  const productInput = document.getElementById("sellerProductName");

  if (!productInput) {
    alert("Seller product input field not found.");
    return;
  }

  const recognition = createVoiceRecognition();

  if (!recognition) {
    return;
  }

  const voiceButton = event?.currentTarget;

  if (voiceButton) {
    voiceButton.disabled = true;
    voiceButton.innerText = "🎤 Listening...";
  }

  productInput.placeholder = "Listening... Please speak in English";
  productInput.focus();

  recognition.onstart = function () {
    console.log("Seller voice recognition started");
  };

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;

    productInput.value = spokenText;

    productInput.dispatchEvent(new Event("input", {
      bubbles: true
    }));

    console.log("Seller recognised text:", spokenText);
  };

  recognition.onerror = function (event) {
    console.error("Seller voice error:", event.error);

    if (event.error === "not-allowed") {
      alert(
        "Microphone permission denied. Please allow microphone access in Chrome."
      );
    } else if (event.error === "no-speech") {
      alert("No speech detected. Please speak clearly and try again.");
    } else if (event.error === "audio-capture") {
      alert("Microphone not found. Please check your microphone.");
    } else {
      alert("Voice recognition error: " + event.error);
    }
  };

  recognition.onend = function () {
    productInput.placeholder = "Enter or speak product name";

    if (voiceButton) {
      voiceButton.disabled = false;
      voiceButton.innerText = "🎤 Speak Product Name";
    }

    console.log("Seller voice recognition ended");
  };

  try {
    recognition.start();
  } catch (error) {
    console.error("Recognition start error:", error);
  }
}


/* =========================
   BUYER VOICE INPUT
========================= */

function startBuyerVoice() {
  const productInput = document.getElementById("buyerProduct");

  if (!productInput) {
    alert("Buyer product input field not found.");
    return;
  }

  const recognition = createVoiceRecognition();

  if (!recognition) {
    return;
  }

  const voiceButton = event?.currentTarget;

  if (voiceButton) {
    voiceButton.disabled = true;
    voiceButton.innerText = "🎤 Listening...";
  }

  productInput.placeholder = "Listening... Please speak in English";
  productInput.focus();

  recognition.onstart = function () {
    console.log("Buyer voice recognition started");
  };

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;

    productInput.value = spokenText;

    productInput.dispatchEvent(new Event("input", {
      bubbles: true
    }));

    console.log("Buyer recognised text:", spokenText);
  };

  recognition.onerror = function (event) {
    console.error("Buyer voice error:", event.error);

    if (event.error === "not-allowed") {
      alert(
        "Microphone permission denied. Please allow microphone access in Chrome."
      );
    } else if (event.error === "no-speech") {
      alert("No speech detected. Please speak clearly and try again.");
    } else if (event.error === "audio-capture") {
      alert("Microphone not found. Please check your microphone.");
    } else {
      alert("Voice recognition error: " + event.error);
    }
  };

  recognition.onend = function () {
    productInput.placeholder = "Enter or speak product name";

    if (voiceButton) {
      voiceButton.disabled = false;
      voiceButton.innerText = "🎤 Speak Product Name";
    }

    console.log("Buyer voice recognition ended");
  };

  try {
    recognition.start();
  } catch (error) {
    console.error("Recognition start error:", error);
  }
}


/* =========================
   IMAGE PREVIEW
========================= */

const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

if (productImage) {
  productImage.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      if (imagePreview) {
        imagePreview.src = event.target.result;
        imagePreview.style.display = "block";
      }

      if (uploadPlaceholder) {
        uploadPlaceholder.style.display = "none";
      }
    };

    reader.readAsDataURL(file);
  });
}


/* =========================
   PRODUCT IMAGE MAPPING
========================= */

function getProductInfo(productName) {
  const name = productName.toLowerCase();

  if (
    name.includes("saree") ||
    name.includes("sari") ||
    name.includes("handloom") ||
    name.includes("cotton") ||
    name.includes("dress") ||
    name.includes("cloth")
  ) {
    return {
      name: "Handloom Cotton Saree",
      description:
        "Beautifully handcrafted cotton saree made by rural artisans.",
      category: "Handloom",
      tags: "Cotton, Saree, Handmade, Traditional",
      image: "images/craft1.jpg"
    };
  }

  if (
    name.includes("pottery") ||
    name.includes("pot") ||
    name.includes("terracotta") ||
    name.includes("clay")
  ) {
    return {
      name: "Traditional Terracotta Pottery",
      description:
        "Eco-friendly handmade pottery created using traditional techniques.",
      category: "Pottery",
      tags: "Clay, Pottery, Handmade, Eco-friendly",
      image: "images/craft2.jpg"
    };
  }

  if (
    name.includes("bamboo") ||
    name.includes("basket") ||
    name.includes("cane") ||
    name.includes("wood")
  ) {
    return {
      name: "Handmade Bamboo Basket",
      description:
        "Strong and sustainable bamboo basket made by skilled rural artisans.",
      category: "Bamboo Craft",
      tags: "Bamboo, Basket, Sustainable, Handmade",
      image: "images/craft3.jpg"
    };
  }

  return {
    name: productName || "Handmade Rural Product",
    description:
      "A unique handmade product created by a skilled rural producer.",
    category: "Handicraft",
    tags: "Handmade, Rural, Traditional",
    image: "images/craft1.jpg"
  };
}


/* =========================
   GENERATE AI CATALOG
========================= */

function generateCatalog() {
  const productName =
    document.getElementById("sellerProductName")?.value.trim();

  const quantity =
    document.getElementById("sellerQuantity")?.value.trim();

  const price =
    document.getElementById("sellerPrice")?.value.trim();

  const location =
    document.getElementById("sellerLocation")?.value.trim();

  if (!productName) {
    alert("Please enter or speak the product name first.");
    return;
  }

  const product = getProductInfo(productName);

  const catalogImage = document.getElementById("catalogImage");
  const catalogName = document.getElementById("catalogName");
  const catalogDescription = document.getElementById("catalogDescription");
  const catalogCategory = document.getElementById("catalogCategory");
  const catalogTags = document.getElementById("catalogTags");
  const catalogQuantity = document.getElementById("catalogQuantity");
  const catalogPrice = document.getElementById("catalogPrice");
  const catalogLocation = document.getElementById("catalogLocation");

  if (catalogImage) {
    catalogImage.src = product.image;
  }

  if (catalogName) {
    catalogName.innerText = product.name;
  }

  if (catalogDescription) {
    catalogDescription.innerText = product.description;
  }

  if (catalogCategory) {
    catalogCategory.innerText = product.category;
  }

  if (catalogTags) {
    catalogTags.innerText = product.tags;
  }

  if (catalogQuantity) {
    catalogQuantity.innerText = quantity || "Not specified";
  }

  if (catalogPrice) {
    catalogPrice.innerText = price
      ? "₹" + price
      : "Price not specified";
  }

  if (catalogLocation) {
    catalogLocation.innerText = location || "Location not specified";
  }

  const catalogResult = document.getElementById("catalogResult");

  if (catalogResult) {
    catalogResult.style.display = "block";
  }

  alert("AI catalog generated successfully!");
}


/* =========================
   PUBLISH PRODUCT
========================= */

function publishProduct() {
  const productName =
    document.getElementById("sellerProductName")?.value.trim();

  const quantity =
    document.getElementById("sellerQuantity")?.value.trim();

  const price =
    document.getElementById("sellerPrice")?.value.trim();

  const location =
    document.getElementById("sellerLocation")?.value.trim();

  if (!productName || !quantity || !price || !location) {
    alert("Please fill all seller details before publishing.");
    return;
  }

  const product = getProductInfo(productName);

  const publishedProduct = {
    name: product.name,
    description: product.description,
    category: product.category,
    tags: product.tags,
    image: product.image,
    quantity: quantity,
    price: price,
    location: location,
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(
    "agriCraftPublishedProduct",
    JSON.stringify(publishedProduct)
  );

  alert("Your product has been published successfully!");

  goToBuyer();
}


/* =========================
   FIND AI MATCHES
========================= */

function findAIMatches() {
  const buyerProduct =
    document.getElementById("buyerProduct")?.value.trim();

  const buyerQuantity =
    document.getElementById("buyerQuantity")?.value.trim();

  const buyerBudget =
    document.getElementById("buyerBudget")?.value.trim();

  if (!buyerProduct) {
    alert("Please enter or speak the product you want to buy.");
    return;
  }

  const product = getProductInfo(buyerProduct);

  const matchedProductImage =
    document.getElementById("matchedProductImage");

  const matchedProductName =
    document.getElementById("matchedProductName");

  const matchedProductDescription =
    document.getElementById("matchedProductDescription");

  const matchedProductDetails =
    document.getElementById("matchedProductDetails");

  const matchEmpty =
    document.getElementById("matchEmpty");

  const matchCard =
    document.getElementById("matchCard");

  if (matchedProductImage) {
    matchedProductImage.src = product.image;
  }

  if (matchedProductName) {
    matchedProductName.innerText = product.name;
  }

  if (matchedProductDescription) {
    matchedProductDescription.innerText = product.description;
  }

  if (matchedProductDetails) {
    matchedProductDetails.innerHTML = `
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Quantity Required:</strong> ${
        buyerQuantity || "Not specified"
      }</p>
      <p><strong>Budget:</strong> ${
        buyerBudget ? "₹" + buyerBudget : "Not specified"
      }</p>
      <p><strong>AI Match:</strong> 94% suitable</p>
    `;
  }

  if (matchEmpty) {
    matchEmpty.style.display = "none";
  }

  if (matchCard) {
    matchCard.style.display = "block";
  }
}


/* =========================
   REQUEST TO BUY
========================= */

function requestToBuy() {
  const buyerProduct =
    document.getElementById("buyerProduct")?.value.trim();

  const buyerQuantity =
    document.getElementById("buyerQuantity")?.value.trim();

  const buyerBudget =
    document.getElementById("buyerBudget")?.value.trim();

  const buyerLocation =
    document.getElementById("buyerLocation")?.value.trim();

  const buyerDate =
    document.getElementById("buyerDate")?.value;

  if (!buyerProduct) {
    alert("Please select or search for a product first.");
    return;
  }

  const product = getProductInfo(buyerProduct);

  const savedProduct = JSON.parse(
    localStorage.getItem("agriCraftPublishedProduct") || "null"
  );

  const orderData = {
    orderId: "AC" + Date.now(),
    buyer: "Buyer",
    seller: savedProduct?.location
      ? "Artisan from " + savedProduct.location
      : "Rural Artisan",
    product: product.name,
    description: product.description,
    image: product.image,
    quantity: buyerQuantity || "1",
    offeredPrice: buyerBudget
      ? "₹" + buyerBudget
      : "Price to be negotiated",
    location: buyerLocation || "Not specified",
    preferredDate: buyerDate || "Not specified",
    status: "Pending",
    verification: "Not Verified",
    createdAt: new Date().toLocaleString("en-IN")
  };

  localStorage.setItem(
    "agriCraftOrder",
    JSON.stringify(orderData)
  );

  console.log("Order saved:", orderData);

  alert("Buy request sent successfully!");

  showOrderRequests();
  goToOrders();
}


/* =========================
   SHOW MY ORDERS
========================= */

function showOrderRequests() {
  const orderOutput = document.getElementById("orderOutput");

  if (!orderOutput) {
    return;
  }

  const savedOrder = localStorage.getItem("agriCraftOrder");

  if (!savedOrder) {
    orderOutput.innerHTML = `
      <div class="empty-order">
        <h3>No orders yet</h3>
        <p>Your requested products will appear here.</p>
      </div>
    `;
    return;
  }

  const order = JSON.parse(savedOrder);

  orderOutput.innerHTML = `
    <div class="order-card">
      <img 
        src="${order.image}" 
        alt="${order.product}"
        class="order-image"
      >

      <div class="order-details">
        <h3>${order.product}</h3>

        <p>${order.description}</p>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Quantity:</strong>
          ${order.quantity}
        </p>

        <p>
          <strong>Offered Price:</strong>
          ${order.offeredPrice}
        </p>

        <p>
          <strong>Location:</strong>
          ${order.location}
        </p>

        <p>
          <strong>Preferred Date:</strong>
          ${order.preferredDate}
        </p>

        <p>
          <strong>Status:</strong>
          <span class="order-status">${order.status}</span>
        </p>

        <p>
          <strong>Verification:</strong>
          ${order.verification}
        </p>

        <div class="order-actions">
          <button onclick="acceptOrder()" type="button">
            Accept
          </button>

          <button onclick="negotiateOrder()" type="button">
            Negotiate
          </button>

          <button onclick="startVerification()" type="button">
            Verify Order
          </button>
        </div>
      </div>
    </div>
  `;
}


/* =========================
   ACCEPT ORDER
========================= */

function acceptOrder() {
  const savedOrder = localStorage.getItem("agriCraftOrder");

  if (!savedOrder) {
    alert("No order found.");
    return;
  }

  const order = JSON.parse(savedOrder);

  order.status = "Accepted";

  localStorage.setItem(
    "agriCraftOrder",
    JSON.stringify(order)
  );

  alert("Order accepted successfully!");

  showOrderRequests();
}


/* =========================
   NEGOTIATE ORDER
========================= */

function negotiateOrder() {
  const newPrice = prompt(
    "Enter your suggested price:"
  );

  if (!newPrice) {
    return;
  }

  const savedOrder = localStorage.getItem("agriCraftOrder");

  if (!savedOrder) {
    alert("No order found.");
    return;
  }

  const order = JSON.parse(savedOrder);

  order.offeredPrice = "₹" + newPrice;
  order.status = "Price Negotiation";

  localStorage.setItem(
    "agriCraftOrder",
    JSON.stringify(order)
  );

  alert("Negotiation offer submitted!");

  showOrderRequests();
}


/* =========================
   START VERIFICATION
========================= */

function startVerification() {
  const savedOrder = localStorage.getItem("agriCraftOrder");

  if (!savedOrder) {
    alert("No order found.");
    return;
  }

  showOTPBox();
}


/* =========================
   OTP BOX
========================= */

function showOTPBox() {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");

  if (!modalOverlay || !modalContent) {
    const otp = prompt(
      "Enter demo verification code 2026:"
    );

    if (otp === "2026") {
      verifyOrder();
    } else {
      alert("Invalid verification code.");
    }

    return;
  }

  modalContent.innerHTML = `
    <div class="otp-box">
      <h2>Verify Your Order</h2>
      <p>Enter the demo OTP sent to your mobile.</p>

      <input
        type="text"
        id="otpInput"
        placeholder="Enter OTP"
        maxlength="4"
      >

      <button type="button" onclick="verifyOrder()">
        Verify
      </button>

      <button type="button" onclick="closeModal()">
        Cancel
      </button>
    </div>
  `;

  modalOverlay.style.display = "flex";
}


/* =========================
   VERIFY ORDER
========================= */

function verifyOrder() {
  const otpInput = document.getElementById("otpInput");

  if (otpInput && otpInput.value !== "2026") {
    alert("Invalid OTP. Use demo code 2026.");
    return;
  }

  const savedOrder = localStorage.getItem("agriCraftOrder");

  if (!savedOrder) {
    alert("No order found.");
    return;
  }

  const order = JSON.parse(savedOrder);

  order.verification = "Verified";
  order.status = "Verified and Confirmed";

  localStorage.setItem(
    "agriCraftOrder",
    JSON.stringify(order)
  );

  closeModal();

  alert("Order verified successfully!");

  showOrderRequests();
}


/* =========================
   MODAL FUNCTIONS
========================= */

function closeModal() {
  const modalOverlay = document.getElementById("modalOverlay");

  if (modalOverlay) {
    modalOverlay.style.display = "none";
  }
}


/* =========================
   RESTORE ORDER ON PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {
  showOrderRequests();

  const savedOrder = localStorage.getItem("agriCraftOrder");

  if (savedOrder) {
    console.log(
      "Saved order restored:",
      JSON.parse(savedOrder)
    );
  }
});
