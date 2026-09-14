/* =========================================
   AGRICRAFT CONNECT
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   NAVIGATION
========================================= */


const navLinks = document.querySelectorAll(".navbar nav a");

navLinks.forEach(link => {
  link.addEventListener("click", function () {
    navLinks.forEach(item => item.classList.remove("active"));
    this.classList.add("active");
  });
});


/* =========================================
   PRODUCT IMAGE UPLOAD + PREVIEW
========================================= */

const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const catalogImage = document.getElementById("catalogImage");

let uploadedImage = "";

if (productImage) {

  productImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

      uploadedImage = event.target.result;

      imagePreview.src = uploadedImage;
      imagePreview.style.display = "block";

      if (catalogImage) {
        catalogImage.src = uploadedImage;
      }
    };

    reader.readAsDataURL(file);
  });
}


/* =========================================
   SELLER VOICE INPUT
========================================= */

function startSellerVoice() {

  const voiceResult = document.getElementById("voiceResult");

  if (!voiceResult) return;

  voiceResult.innerHTML = `
    🎙️ <strong>Listening...</strong><br>
    Speak your product details in your preferred language.
  `;

  setTimeout(() => {

    voiceResult.innerHTML = `
      ✓ Voice captured successfully.<br>
      <span>
        Example: Handwoven cotton saree, 20 pieces,
        expected price ₹2,000, location Eluru.
      </span>
    `;

  }, 1800);
}


/* =========================================
   GENERATE SMART CATALOG
========================================= */

function generateCatalog() {

  const catalogResult = document.getElementById("catalogResult");

  const nameInput = document.getElementById("productName");
  const quantityInput = document.getElementById("productQuantity");
  const priceInput = document.getElementById("productPrice");
  const locationInput = document.getElementById("productLocation");

  const catalogName = document.getElementById("catalogName");
  const catalogQuantity = document.getElementById("catalogQuantity");
  const catalogPrice = document.getElementById("catalogPrice");
  const catalogLocation = document.getElementById("catalogLocation");
  const catalogDescription =
    document.getElementById("catalogDescription");

  const name =
    nameInput.value.trim() || "Handwoven Cotton Saree";

  const quantity =
    quantityInput.value || "20";

  const price =
    priceInput.value || "2000";

  const location =
    locationInput.value.trim() || "Eluru";


  /* AI DEMO OUTPUT */

  catalogName.textContent = name;

  catalogQuantity.textContent = quantity;

  catalogPrice.textContent =
    "₹" + Number(price).toLocaleString("en-IN");

  catalogLocation.textContent = location;

  catalogDescription.textContent =
    `${name} created by a rural producer from ${location}. ` +
    `AI-assisted cataloging generates product information, ` +
    `category and searchable tags.`;


  /* Product image */

  if (uploadedImage) {
    catalogImage.src = uploadedImage;
  } else {
    catalogImage.src = "images/craft1.jpg";
  }


  /* Show result */

  catalogResult.style.display = "block";

  catalogResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================
   PUBLISH PRODUCT
========================================= */

function publishProduct() {

  const catalogName =
    document.getElementById("catalogName").textContent;

  const catalogQuantity =
    document.getElementById("catalogQuantity").textContent;

  const catalogPrice =
    document.getElementById("catalogPrice").textContent;

  const catalogLocation =
    document.getElementById("catalogLocation").textContent;


  localStorage.setItem(
    "agriCraftProduct",
    JSON.stringify({
      name: catalogName,
      quantity: catalogQuantity,
      price: catalogPrice,
      location: catalogLocation,
      published: true
    })
  );


  alert(
    "✓ Product published successfully!\n\n" +
    "Your product is now available for AI buyer matching."
  );
}


/* =========================================
   BUYER VOICE INPUT
========================================= */

function startBuyerVoice() {

  const button = event.currentTarget;

  button.innerHTML = "🎙️ Listening...";

  setTimeout(() => {

    const product =
      document.getElementById("buyerProduct");

    const quantity =
      document.getElementById("buyerQuantity");

    const budget =
      document.getElementById("buyerBudget");

    const location =
      document.getElementById("buyerLocation");


    if (product) {
      product.value = "Cotton Handloom Sarees";
    }

    if (quantity) {
      quantity.value = "50";
    }

    if (budget) {
      budget.value = "₹1,500 - ₹2,200";
    }

    if (location) {
      location.value = "Hyderabad";
    }

    button.innerHTML =
      "✓ Voice Requirement Captured";

  }, 1800);
}


function findAIMatches() {
  const matchResults = document.getElementById("matchResults");

  const productInput = document.getElementById("buyerProduct");
  const quantityInput = document.getElementById("buyerQuantity");
  const budgetInput = document.getElementById("buyerBudget");
  const locationInput = document.getElementById("buyerLocation");

  const product = productInput.value.trim().toLowerCase();
  const quantity = quantityInput.value;
  const budget = budgetInput.value;
  const location = locationInput.value;

  if (!product) {
    alert("Please enter a product name.");
    return;
  }

  const productData = {
    saree: {
      name: "Handwoven Cotton Saree",
      image: "images/craft1.jpg",
      description: "Traditional cotton handloom saree made by a rural artisan.",
      quantity: "20 pieces",
      price: "₹2,000 / piece",
      sellerLocation: "Eluru"
    },

    pottery: {
      name: "Handmade Terracotta Pottery",
      image: "images/craft2.jpg",
      description: "Beautiful handmade terracotta pottery created by skilled artisans.",
      quantity: "35 pieces",
      price: "₹450 / piece",
      sellerLocation: "Machilipatnam"
    },

    bamboo: {
      name: "Bamboo Handicraft Basket",
      image: "images/craft3.jpg",
      description: "Eco-friendly bamboo basket made using traditional craftsmanship.",
      quantity: "40 pieces",
      price: "₹350 / piece",
      sellerLocation: "Rajahmundry"
    }
  };

  let selectedProduct;

  if (
    product.includes("saree") ||
    product.includes("handloom") ||
    product.includes("cotton")
  ) {
    selectedProduct = productData.saree;
  } else if (
    product.includes("pottery") ||
    product.includes("terracotta") ||
    product.includes("pot")
  ) {
    selectedProduct = productData.pottery;
  } else if (
    product.includes("bamboo") ||
    product.includes("basket")
  ) {
    selectedProduct = productData.bamboo;
  } else {
    selectedProduct = productData.saree;
  }

  document.querySelector(".match-product-image img").src =
    selectedProduct.image;

  document.querySelector(".match-product-info h3").textContent =
    selectedProduct.name;

  document.querySelector(".match-product-info p").textContent =
    selectedProduct.description;

  document.querySelector(".match-details").innerHTML = `
    <span>📦 ${selectedProduct.quantity}</span>
    <span>${selectedProduct.price}</span>
    <span>📍 ${selectedProduct.sellerLocation}</span>
  `;

  localStorage.setItem(
    "agriCraftBuyerRequirement",
    JSON.stringify({
      product,
      quantity,
      budget,
      location
    })
  );

  matchResults.style.display = "block";

  matchResults.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================
   REQUEST TO BUY
========================================= */

function requestToBuy() {

  const requirement =
    JSON.parse(
      localStorage.getItem(
        "agriCraftBuyerRequirement"
      )
    ) || {};


  const orderRequest = {

    product:
      requirement.product ||
      "Handwoven Cotton Saree",

    quantity:
      requirement.quantity ||
      "50",

    budget:
      requirement.budget ||
      "₹1,500 - ₹2,200",

    buyerLocation:
      requirement.location ||
      "Hyderabad",

    sellerLocation:
      "Eluru",

    price:
      "₹2,000 / piece",

    status:
      "Buyer Request Sent"

  };


  localStorage.setItem(
    "agriCraftOrderRequest",
    JSON.stringify(orderRequest)
  );


  alert(
    "✓ Request to Buy sent successfully!\n\n" +
    "The seller can now Accept, Reject or Negotiate."
  );


  document
    .getElementById("orders")
    .scrollIntoView({
      behavior: "smooth"
    });
}


/* =========================================
   VIEW BUYER REQUESTS
========================================= */

function showOrderRequests() {

  const orderResult =
    document.getElementById("orderResult");


  const request =
    JSON.parse(
      localStorage.getItem(
        "agriCraftOrderRequest"
      )
    );


  if (!request) {

    orderResult.innerHTML = `
      <div class="order-box">
        <span class="order-status">
          No Requests
        </span>

        <h3>No buyer requests yet</h3>

        <p>
          When a buyer sends a Request to Buy,
          it will appear here.
        </p>
      </div>
    `;

    return;
  }


  orderResult.innerHTML = `

    <div class="order-box">

      <span class="order-status">
        NEW BUYER REQUEST
      </span>

      <h3>
        ${request.product}
      </h3>

      <div class="order-info">

        <div>
          <strong>Buyer Requirement</strong><br>
          ${request.quantity} pieces
        </div>

        <div>
          <strong>Budget</strong><br>
          ${request.budget}
        </div>

        <div>
          <strong>Delivery Location</strong><br>
          ${request.buyerLocation}
        </div>

        <div>
          <strong>Seller Location</strong><br>
          ${request.sellerLocation}
        </div>

      </div>

      <br>

      <button
        class="btn primary"
        onclick="acceptOrder()"
      >
        ✓ Accept Request
      </button>

      <button
        class="btn secondary"
        onclick="negotiateOrder()"
      >
        Negotiate
      </button>

    </div>
  `;
}


/* =========================================
   ACCEPT ORDER
========================================= */

function acceptOrder() {

  const request =
    JSON.parse(
      localStorage.getItem(
        "agriCraftOrderRequest"
      )
    );


  if (!request) return;


  request.status =
    "Seller Accepted";


  localStorage.setItem(
    "agriCraftOrderRequest",
    JSON.stringify(request)
  );


  alert(
    "✓ Buyer request accepted.\n\n" +
    "Next step: Voice verification."
  );


  showVerification();
}


/* =========================================
   NEGOTIATE ORDER
========================================= */

function negotiateOrder() {

  const newPrice =
    prompt(
      "Enter your negotiated price per piece:",
      "₹1,900"
    );


  if (!newPrice) return;


  const request =
    JSON.parse(
      localStorage.getItem(
        "agriCraftOrderRequest"
      )
    );


  if (!request) return;


  request.negotiatedPrice = newPrice;

  request.status =
    "Price Negotiation Sent";


  localStorage.setItem(
    "agriCraftOrderRequest",
    JSON.stringify(request)
  );


  alert(
    "✓ Negotiated price sent to buyer."
  );
}


/* =========================================
   VOICE VERIFICATION
========================================= */

function showVerification() {

  const orderResult =
    document.getElementById("orderResult");


  orderResult.innerHTML = `

    <div class="order-box">

      <span class="order-status">
        VOICE VERIFICATION
      </span>

      <h3>Confirm Your Order</h3>

      <p>
        A verification call will be placed
        to the registered mobile number.
      </p>

      <br>

      <div class="order-info">

        <div>
          <strong>Step 1</strong><br>
          Receive verification call
        </div>

        <div>
          <strong>Step 2</strong><br>
          Press 1 to confirm
        </div>

        <div>
          <strong>Step 3</strong><br>
          Enter verification code
        </div>

        <div>
          <strong>Step 4</strong><br>
          Order gets verified
        </div>

      </div>

      <br>

      <button
        class="btn primary"
        onclick="verifyOrder()"
      >
        📞 Simulate Verification Call
      </button>

    </div>
  `;
}


/* =========================================
   VERIFY ORDER
========================================= */

function verifyOrder() {

  const code =
    prompt(
      "Enter the 4-digit verification code:",
      "2026"
    );


  if (!code) return;


  if (code !== "2026") {

    alert(
      "Invalid verification code.\n" +
      "For this prototype demo, use 2026."
    );

    return;
  }


  const request =
    JSON.parse(
      localStorage.getItem(
        "agriCraftOrderRequest"
      )
    );


  if (!request) return;


  request.status =
    "Verified Order";


  request.verification =
    "Voice + OTP Verified";


  request.orderId =
    "AC-" +
    Math.floor(
      100000 + Math.random() * 900000
    );


  request.date =
    new Date().toLocaleString("en-IN");


  localStorage.setItem(
    "agriCraftVerifiedOrder",
    JSON.stringify(request)
  );


  alert(
    "✓ Order Verified Successfully!"
  );


  showVerifiedOrder();
}


/* =========================================
   SHOW VERIFIED ORDER / DIGITAL RECEIPT
========================================= */

function showVerifiedOrder() {

  const orderResult =
    document.getElementById("orderResult");


  const order =
    JSON.parse(
      localStorage.getItem(
        "agriCraftVerifiedOrder"
      )
    );


  if (!order) {

    orderResult.innerHTML = `
      <div class="order-box">

        <span class="order-status">
          NO VERIFIED ORDER
        </span>

        <h3>
          No verified order available
        </h3>

        <p>
          Complete the buyer request and
          verification process first.
        </p>

      </div>
    `;

    return;
  }


  orderResult.innerHTML = `

    <div class="order-box">

      <span class="order-status">
        ✓ VERIFIED ORDER
      </span>

      <h3>
        Digital Order Receipt
      </h3>

      <div class="order-info">

        <div>
          <strong>Order ID</strong><br>
          ${order.orderId}
        </div>

        <div>
          <strong>Product</strong><br>
          ${order.product}
        </div>

        <div>
          <strong>Quantity</strong><br>
          ${order.quantity} pieces
        </div>

        <div>
          <strong>Price</strong><br>
          ${order.negotiatedPrice || order.price}
        </div>

        <div>
          <strong>Buyer Location</strong><br>
          ${order.buyerLocation}
        </div>

        <div>
          <strong>Seller Location</strong><br>
          ${order.sellerLocation}
        </div>

        <div>
          <strong>Verification</strong><br>
          ${order.verification}
        </div>

        <div>
          <strong>Date & Time</strong><br>
          ${order.date}
        </div>

      </div>

      <br>

      <button
        class="btn primary"
        onclick="downloadReceipt()"
      >
        🧾 Generate Receipt
      </button>

    </div>
  `;
}


/* =========================================
   DIGITAL RECEIPT
========================================= */

function downloadReceipt() {

  const order =
    JSON.parse(
      localStorage.getItem(
        "agriCraftVerifiedOrder"
      )
    );


  if (!order) return;


  const receipt = `

AGRICRAFT CONNECT
DIGITAL ORDER RECEIPT
--------------------------------

Order ID:
${order.orderId}

Product:
${order.product}

Quantity:
${order.quantity} pieces

Price:
${order.negotiatedPrice || order.price}

Buyer Location:
${order.buyerLocation}

Seller Location:
${order.sellerLocation}

Verification:
${order.verification}

Date:
${order.date}

--------------------------------
ORDER STATUS: VERIFIED ✓

AgriCraft Connect
AI-powered market linkage
for rural producers.

`;


  const blob =
    new Blob(
      [receipt],
      { type: "text/plain" }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "AgriCraft-Order-Receipt.txt";

  link.click();


  URL.revokeObjectURL(url);
}


/* =========================================
   LOAD SAVED PRODUCT
========================================= */

window.addEventListener("load", function () {

  const savedProduct =
    JSON.parse(
      localStorage.getItem(
        "agriCraftProduct"
      )
    );


  if (!savedProduct) return;


  const productName =
    document.getElementById("productName");

  const productQuantity =
    document.getElementById("productQuantity");

  const productPrice =
    document.getElementById("productPrice");

  const productLocation =
    document.getElementById("productLocation");


  if (productName)
    productName.value =
      savedProduct.name;

  if (productQuantity)
    productQuantity.value =
      savedProduct.quantity;

  if (productPrice)
    productPrice.value =
      savedProduct.price.replace(
        /[^0-9]/g,
        ""
      );

  if (productLocation)
    productLocation.value =
      savedProduct.location;

});
/* ================================
   MOBILE MENU
================================ */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

        if (navLinks.classList.contains("active")) {
            menuToggle.innerHTML = "✕";
        } else {
            menuToggle.innerHTML = "☰";
        }
    });


    // Close menu after clicking a link
    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuToggle.innerHTML = "☰";
        });
    });
}

