/* =================================
   GLOBAL DATA
================================= */

let selectedProduct = {
    name: "Handwoven Cotton Saree",
    description: "Traditional handloom product from a rural artisan.",
    image: "images/craft1.jpg",
    quantity: 20,
    price: 2000,
    location: "Eluru"
};

let buyerRequest = null;
let orderData = null;


/* =================================
   MOBILE NAVBAR
================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }
    });

    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach(function (item) {
        item.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuToggle.textContent = "☰";
        });
    });
}


/* =================================
   NAVIGATION BUTTONS
================================= */

function goToSeller() {
    const sellerSection = document.getElementById("seller");

    if (sellerSection) {
        sellerSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function goToBuyer() {
    const buyerSection = document.getElementById("buyer");

    if (buyerSection) {
        buyerSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =================================
   IMAGE UPLOAD PREVIEW
================================= */

const productImageInput = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");

if (productImageInput) {

    productImageInput.addEventListener("change", function (event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
            uploadPlaceholder.style.display = "none";
        };

        reader.readAsDataURL(file);
    });
}


/* =================================
   SELLER VOICE SIMULATION
================================= */

function startSellerVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN"; 
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  alert("Please speak now...");

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;

    document.getElementById("sellerProductName").value = spokenText;

    console.log("Seller voice text:", spokenText);
  };

  recognition.onerror = function (event) {
    alert("Voice recognition error: " + event.error);
  };
}
/* =================================
   GENERATE SMART CATALOG
================================= */

function generateCatalog() {

    const productName =
        document.getElementById("sellerProductName").value.trim();

    const quantity =
        document.getElementById("sellerQuantity").value || 20;

    const price =
        document.getElementById("sellerPrice").value || 2000;

    const location =
        document.getElementById("sellerLocation").value.trim() || "Eluru";

    const processing =
        document.getElementById("aiProcessing");

    const catalogResult =
        document.getElementById("catalogResult");

    const catalogEmpty =
        document.getElementById("catalogEmpty");

    if (!productName) {
        alert("Please enter or speak the product name first.");
        return;
    }

    processing.style.display = "flex";
    catalogResult.style.display = "none";
    catalogEmpty.style.display = "none";

    setTimeout(function () {

        const productInfo = getProductInfo(productName);

        selectedProduct = {
            name: productInfo.name,
            description: productInfo.description,
            image: productInfo.image,
            quantity: quantity,
            price: price,
            location: location
        };

        document.getElementById("catalogImage").src =
            productInfo.image;

        document.getElementById("catalogName").textContent =
            productInfo.name;

        document.getElementById("catalogDescription").textContent =
            productInfo.description;

        document.getElementById("catalogCategory").textContent =
            "Category: " + productInfo.category;

        document.getElementById("catalogTags").textContent =
            "Tags: " + productInfo.tags;

        document.getElementById("catalogQuantity").textContent =
            "Quantity: " + quantity;

        document.getElementById("catalogPrice").textContent =
            "Price: ₹" + Number(price).toLocaleString("en-IN");

        document.getElementById("catalogLocation").textContent =
            "Location: " + location;

        processing.style.display = "none";
        catalogResult.style.display = "block";

    }, 1500);
}


/* =================================
   PRODUCT INFORMATION MAPPING
================================= */

function getProductInfo(productName) {

    const name = productName.toLowerCase();

    if (
        name.includes("saree") ||
        name.includes("sari") ||
        name.includes("handloom") ||
        name.includes("cotton")
    ) {
        return {
            name: "Handwoven Cotton Saree",
            description:
                "Traditional cotton handloom saree made by a rural artisan.",
            image: "images/craft1.jpg",
            category: "Handloom",
            tags: "Cotton, Handmade, Traditional"
        };
    }

    if (
        name.includes("pottery") ||
        name.includes("pot") ||
        name.includes("terracotta")
    ) {
        return {
            name: "Handmade Terracotta Pottery",
            description:
                "Beautiful handmade terracotta pottery created by local artisans.",
            image: "images/craft2.jpg",
            category: "Pottery",
            tags: "Terracotta, Handmade, Craft"
        };
    }

    if (
        name.includes("bamboo") ||
        name.includes("basket")
    ) {
        return {
            name: "Bamboo Handicraft Basket",
            description:
                "Eco-friendly bamboo basket made using traditional craft skills.",
            image: "images/craft3.jpg",
            category: "Bamboo Craft",
            tags: "Bamboo, Eco-friendly, Handmade"
        };
    }

    return {
        name: productName,
        description:
            "Handmade product listed by a rural producer.",
        image: "images/craft1.jpg",
        category: "Rural Product",
        tags: "Handmade, Local, Traditional"
    };
}


/* =================================
   PUBLISH PRODUCT
================================= */

function publishProduct() {

    localStorage.setItem(
        "agriCraftProduct",
        JSON.stringify(selectedProduct)
    );

    alert("✓ Product published successfully!");

    document.getElementById("buyer").scrollIntoView({
        behavior: "smooth"
    });
}


/* =================================
   BUYER VOICE SIMULATION
================================= */

function startBuyerVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser. Please use Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  alert("Please speak now...");

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;

    document.getElementById("buyerProduct").value = spokenText;

    console.log("Buyer voice text:", spokenText);
  };

  recognition.onerror = function (event) {
    alert("Voice recognition error: " + event.error);
  };
}/* =================================
   AI MATCHING
================================= */

function findAIMatches() {

    const productInput =
        document.getElementById("buyerProduct").value.trim();

    const quantity =
        document.getElementById("buyerQuantity").value || 1;

    const budget =
        document.getElementById("buyerBudget").value || 0;

    const location =
        document.getElementById("buyerLocation").value.trim() ||
        "Hyderabad";

    const requiredDate =
        document.getElementById("buyerDate").value || "Not specified";

    if (!productInput) {
        alert("Please enter the product you are looking for.");
        return;
    }

    const productInfo = getProductInfo(productInput);

    selectedProduct = {
        ...selectedProduct,
        name: productInfo.name,
        description: productInfo.description,
        image: productInfo.image
    };

    buyerRequest = {
        product: productInfo.name,
        quantity: quantity,
        budget: budget,
        location: location,
        date: requiredDate
    };

    document.getElementById("matchedProductImage").src =
        productInfo.image;

    document.getElementById("matchedProductName").textContent =
        productInfo.name;

    document.getElementById("matchedProductDescription").textContent =
        productInfo.description;

    document.getElementById("matchedProductDetails").innerHTML = `
        <span>📦 ${selectedProduct.quantity || 20} pieces</span>
        <span>₹${Number(selectedProduct.price || 2000).toLocaleString("en-IN")} / piece</span>
        <span>📍 ${selectedProduct.location || "Eluru"}</span>
    `;

    document.getElementById("matchEmpty").style.display = "none";
    document.getElementById("matchCard").style.display = "block";

    document.getElementById("matchCard").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


/* =================================
   REQUEST TO BUY
================================= */

/* =================================
   GO TO ORDERS
================================= */function requestToBuy() {
    const productName =
        document.getElementById("matchedProductName").textContent;

    const quantity =
        document.getElementById("buyerQuantity").value || "1";

    const budget =
        document.getElementById("buyerBudget").value || "0";

    const location =
        document.getElementById("buyerLocation").value || "Not specified";

    const requiredDate =
        document.getElementById("buyerDate").value || "Not specified";

    orderData = {
        orderId: "AC-" + Date.now(),
        buyer: "Demo Buyer",
        seller: "Verified Rural Producer",
        product: productName,
        quantity: quantity,
        offeredPrice: budget,
        location: location,
        date: requiredDate,
        status: "Pending",
        verification: "Not Verified",
        createdAt: new Date().toLocaleString("en-IN")
    };

    localStorage.setItem(
        "agriCraftOrder",
        JSON.stringify(orderData)
    );

    openModal(`
        <div class="modal-heading">
            <div class="modal-icon">📩</div>
            <h2>Request Sent Successfully</h2>
            <p>Your buyer request has been saved.</p>
        </div>

        <div class="modal-summary">
            <p><strong>Product:</strong> ${orderData.product}</p>
            <p><strong>Quantity:</strong> ${orderData.quantity}</p>
            <p><strong>Budget:</strong> ₹${orderData.offeredPrice} / piece</p>
            <p><strong>Location:</strong> ${orderData.location}</p>
        </div>

        <button
            class="btn primary full-btn"
            onclick="closeModal(); goToOrders(); showOrderRequests();"
        >
            View My Order
        </button>
    `);
}


/* =================================
   SHOW ORDER REQUESTS
================================= */

function showOrderRequests() {
    const output = document.getElementById("orderOutput");

    const savedOrder =
        JSON.parse(localStorage.getItem("agriCraftOrder"));

    output.style.display = "block";

    if (!savedOrder) {
        output.innerHTML = `
            <div class="request-box">
                <h3>No orders found</h3>
                <p>First search a product and click Request to Buy.</p>
            </div>
        `;
        return;
    }

    output.innerHTML = `
        <div class="request-box">
            <h3>📩 Saved Buyer Request</h3>

            <p><strong>Order ID:</strong> ${savedOrder.orderId}</p>
            <p><strong>Buyer:</strong> ${savedOrder.buyer}</p>
            <p><strong>Product:</strong> ${savedOrder.product}</p>
            <p><strong>Quantity:</strong> ${savedOrder.quantity}</p>
            <p><strong>Offered Price:</strong> ₹${savedOrder.offeredPrice} / piece</p>
            <p><strong>Delivery Location:</strong> ${savedOrder.location}</p>
            <p><strong>Required By:</strong> ${savedOrder.date}</p>
            <p><strong>Status:</strong> ${savedOrder.status}</p>

            <div class="request-actions">
                <button
                    class="small-btn accept-btn"
                    onclick="acceptOrder()"
                >
                    Accept
                </button>

                <button
                    class="small-btn negotiate-btn"
                    onclick="negotiateOrder()"
                >
                    Negotiate
                </button>
            </div>
        </div>
    `;
}


/* =================================
   ACCEPT ORDER
================================= */

function acceptOrder() {

    const savedOrder =
        JSON.parse(localStorage.getItem("agriCraftOrder"));

    if (!savedOrder) {
        return;
    }

    savedOrder.status = "Accepted";
    localStorage.setItem(
        "agriCraftOrder",
        JSON.stringify(savedOrder)
    );

    openModal(`
        <div class="modal-heading">
            <div class="modal-icon">✅</div>
            <h2>Request Accepted</h2>
            <p>
                The order is ready for voice verification.
            </p>
        </div>

        <button
            class="btn primary full-btn"
            onclick="startVerification()"
        >
            Start Verification
        </button>
    `);
}


/* =================================
   NEGOTIATE ORDER
================================= */

function negotiateOrder() {

    openModal(`
        <div class="modal-heading">
            <div class="modal-icon">💬</div>
            <h2>Negotiate Price</h2>
            <p>
                Enter your proposed price for this order.
            </p>
        </div>

        <label class="field-label">Your Proposed Price</label>

        <input
            type="number"
            id="negotiationPrice"
            placeholder="Enter price"
        >

        <button
            class="btn primary full-btn"
            onclick="submitNegotiation()"
        >
            Send Proposal
        </button>
    `);
}

function submitNegotiation() {

    const price =
        document.getElementById("negotiationPrice").value;

    if (!price) {
        alert("Please enter a proposed price.");
        return;
    }

    closeModal();

    alert(
        "✓ Negotiation proposal sent: ₹" +
        Number(price).toLocaleString("en-IN") +
        " per piece"
    );
}


/* =================================
   VOICE / OTP VERIFICATION
================================= */

function startVerification() {

    closeModal();

    setTimeout(function () {

        openModal(`
            <div class="modal-heading">
                <div class="modal-icon">📞</div>
                <h2>Voice Verification</h2>
                <p>
                    A verification call is being simulated to the
                    registered mobile number.
                </p>
            </div>

            <div class="verification-box">
                <p>Press <strong>1</strong> to confirm the order.</p>
                <p>Press <strong>2</strong> to cancel the order.</p>
            </div>

            <button
                class="btn primary full-btn"
                onclick="showOTPBox()"
            >
                Press 1 — Confirm
            </button>
        `);

    }, 300);
}

function showOTPBox() {

    openModal(`
        <div class="modal-heading">
            <div class="modal-icon">🔐</div>
            <h2>Enter Verification Code</h2>
            <p>
                Demo verification code is <strong>2026</strong>.
            </p>
        </div>

        <input
            type="text"
            id="verificationCode"
            placeholder="Enter 4-digit code"
            maxlength="4"
        >

        <button
            class="btn primary full-btn"
            onclick="verifyOrder()"
        >
            Verify Order
        </button>
    `);
}

function verifyOrder() {

    const code =
        document.getElementById("verificationCode").value;

    if (code !== "2026") {
        alert("Incorrect code. Use demo code 2026.");
        return;
    }

    const savedOrder =
        JSON.parse(localStorage.getItem("agriCraftOrder"));

    if (savedOrder) {
        savedOrder.status = "Verified";
        savedOrder.verification = "Voice + OTP Verified";
        savedOrder.orderId =
            "AC-" + Math.floor(100000 + Math.random() * 900000);

        savedOrder.confirmedAt =
            new Date().toLocaleString("en-IN");

        localStorage.setItem(
            "agriCraftOrder",
            JSON.stringify(savedOrder)
        );
    }

    openModal(`
        <div class="modal-heading">
            <div class="modal-icon">🎉</div>
            <h2>Order Verified Successfully</h2>
            <p>
                Your digital order receipt has been generated.
            </p>
        </div>

        <button
            class="btn primary full-btn"
            onclick="closeModal(); showVerifiedOrder();"
        >
            View Digital Receipt
        </button>
    `);
}


/* =================================
   SHOW VERIFIED ORDER
================================= */

function showVerifiedOrder() {

    const output = document.getElementById("orderOutput");

    const savedOrder =
        JSON.parse(localStorage.getItem("agriCraftOrder"));

    if (!savedOrder || savedOrder.status !== "Verified") {

        output.style.display = "block";

        output.innerHTML = `
            <div class="receipt-box">
                <h3>No verified order available</h3>
                <p>
                    Complete the buyer request and verification process
                    to generate a receipt.
                </p>
            </div>
        `;

        return;
    }

    output.style.display = "block";

    output.innerHTML = `
        <div class="receipt-box">
            <h3>🧾 Digital Order Receipt</h3>

            <p><strong>Order ID:</strong> ${savedOrder.orderId}</p>
            <p><strong>Buyer:</strong> ${savedOrder.buyer}</p>
            <p><strong>Seller:</strong> ${savedOrder.seller}</p>
            <p><strong>Product:</strong> ${savedOrder.product}</p>
            <p><strong>Quantity:</strong> ${savedOrder.quantity}</p>
            <p><strong>Price:</strong> ₹${savedOrder.offeredPrice} / piece</p>
            <p><strong>Delivery Location:</strong> ${savedOrder.location}</p>
            <p><strong>Required By:</strong> ${savedOrder.date}</p>
            <p><strong>Verification:</strong> ${savedOrder.verification}</p>
            <p><strong>Confirmed At:</strong> ${savedOrder.confirmedAt}</p>

            <div class="verified-tag">
                ✓ ORDER CONFIRMED
            </div>
        </div>
    `;

    output.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =================================
   MODAL FUNCTIONS
================================= */

function openModal(content) {

    document.getElementById("modalContent").innerHTML = content;

    document.getElementById("modalOverlay").classList.add("active");
}

function closeModal() {
    document.getElementById("modalOverlay").classList.remove("active");
}

document.getElementById("modalOverlay").addEventListener("click", function (event) {

    if (event.target === this) {
        closeModal();
    }

});
document.addEventListener("DOMContentLoaded", function () {
    const savedOrder =
        JSON.parse(localStorage.getItem("agriCraftOrder"));

    if (savedOrder) {
        orderData = savedOrder;
    }
});
