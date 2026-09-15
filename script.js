
/* =========================================================
   AGRICRAFT CONNECT - UPDATED MAIN JAVASCRIPT
   ========================================================= */

/* ================= GLOBAL DATA ================= */

let selectedLanguage =
    localStorage.getItem("agriCraftLanguage") || "en-IN";

let sellerLanguage =
    localStorage.getItem("agriCraftSellerLanguage") || "en-IN";

let homeLanguage =
    localStorage.getItem("agriCraftHomeLanguage") || "en-IN";

let currentCatalog = null;
let currentMatch = null;


/* ================= HELPER FUNCTIONS ================= */

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

function setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.value = value;
    }
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function scrollToSection(id) {
    const section = document.getElementById(id);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .trim();
}

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ================= HOME BUTTONS ================= */

function goToSeller() {
    scrollToSection("seller");
}

function goToBuyer() {
    scrollToSection("buyer");
}


/* ================= MOBILE MENU ================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                navLinks.classList.remove("active");
                navLinks.classList.remove("open");
            });

        });
    }

    const languageSelect =
        document.getElementById("languageSelect");

    if (languageSelect) {
        languageSelect.value = selectedLanguage;
    }

    const sellerLanguageSelect =
        document.getElementById("sellerLanguageSelect");

    if (sellerLanguageSelect) {
        sellerLanguageSelect.value = sellerLanguage;
    }

    const homeLanguageSelect =
        document.getElementById("homeLanguageSelect");

    if (homeLanguageSelect) {
        homeLanguageSelect.value = homeLanguage;
    }

    setupImagePreview();
    initializePage();

});


/* ================= IMAGE PREVIEW ================= */

function setupImagePreview() {

    const input = document.getElementById("productImage");
    const preview = document.getElementById("imagePreview");
    const placeholder =
        document.getElementById("uploadPlaceholder");

    const uploadArea =
        document.getElementById("uploadArea");

    if (!input) return;

    input.addEventListener("change", function () {

        const file = input.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            if (preview) {
                preview.src = event.target.result;
                preview.style.display = "block";
            }

            if (placeholder) {
                placeholder.style.display = "none";
            }

        };

        reader.readAsDataURL(file);
    });

    if (uploadArea) {

        uploadArea.addEventListener("click", function (event) {

            if (event.target !== input) {
                input.click();
            }

        });
    }
}


/* ================= VOICE RECOGNITION ================= */

function createVoiceRecognition(
    statusId,
    callback,
    languageCode = selectedLanguage
) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const status =
        document.getElementById(statusId);

    if (!SpeechRecognition) {

        if (status) {
            status.textContent =
                "Voice recognition is not supported. Please use Google Chrome.";
        }

        alert(
            "Voice recognition works best in Google Chrome or Microsoft Edge."
        );

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = languageCode;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {

        if (status) {
            status.textContent =
                "🎙️ Listening... Please speak now.";
        }
    };

    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript.trim();

        if (status) {
            status.textContent =
                "✅ Voice recognized: " + transcript;
        }

        if (callback) {
            callback(transcript);
        }
    };

    recognition.onerror = function (event) {

        let message = "Voice recognition failed.";

        if (event.error === "not-allowed") {
            message =
                "Microphone permission denied. Please allow microphone access.";
        }

        if (event.error === "no-speech") {
            message =
                "No speech detected. Please try again.";
        }

        if (event.error === "network") {
            message =
                "Network error. Please check your internet connection.";
        }

        if (status) {
            status.textContent = "⚠️ " + message;
        }
    };

    recognition.onend = function () {

        if (
            status &&
            status.textContent.includes("Listening")
        ) {
            status.textContent =
                "You can use voice again.";
        }
    };

    try {
        recognition.start();
    } catch (error) {
        console.log("Voice recognition error:", error);
    }
}


/* ================= SELLER VOICE ================= */

function startSellerVoice() {

    createVoiceRecognition(
        "sellerVoiceStatus",
        function (text) {

            const productName =
                document.getElementById("sellerProductName");

            if (productName) {
                productName.value = text;
            }

            const quantityMatch =
                text.match(
                    /(\d+)\s*(pieces?|piece|items?|item|kg|kgs|kilos?|కిలోలు|కిలో|नग|नगों|किलो)/i
                );

            if (quantityMatch) {

                const quantity =
                    document.getElementById("sellerQuantity");

                if (quantity) {
                    quantity.value = quantityMatch[1];
                }
            }

            const priceMatch =
                text.match(
                    /(?:₹|rs\.?|rupees?|రూపాయలు|రూపాయలు|रुपये|रुपए)\s*(\d+)/i
                );

            if (priceMatch) {

                const price =
                    document.getElementById("sellerPrice");

                if (price) {
                    price.value = priceMatch[1];
                }
            }

        },
        sellerLanguage
    );
}


/* ================= BUYER VOICE ================= */

function startBuyerVoice() {

    createVoiceRecognition(
        "buyerVoiceStatus",
        function (text) {

            const product =
                document.getElementById("buyerProduct");

            if (product) {
                product.value = text;
            }

        },
        selectedLanguage
    );
}


/* ================= HOME VOICE ================= */

function startHomeVoice() {

    createVoiceRecognition(
        "homeVoiceStatus",
        function (text) {

            const homeInput =
                document.getElementById("homeSearchInput");

            if (homeInput) {
                homeInput.value = text;
            }

        },
        homeLanguage
    );
}


/* ================= LANGUAGE SYSTEM ================= */

const translations = {

    "en-IN": {
        sell: "Sell",
        buy: "Buy",
        orders: "My Orders",
        about: "About",

        sellerTitle: "Sell Your Product",
        buyerTitle: "Find Products Easily",

        productName: "Product Name",
        quantity: "Quantity",
        expectedPrice: "Expected Price",
        location: "Location",

        generateCatalog: "Generate Smart Catalog",
        publishProduct: "Publish Product",

        productNeeded: "Product Needed",
        budget: "Budget Per Piece",
        deliveryLocation: "Delivery Location",
        requiredBy: "Required By",

        findMatches: "Find AI Matches",
        requestBuy: "Request to Buy"
    },

    "te-IN": {
        sell: "అమ్మండి",
        buy: "కొనండి",
        orders: "నా ఆర్డర్లు",
        about: "మా గురించి",

        sellerTitle: "మీ ఉత్పత్తిని అమ్మండి",
        buyerTitle: "ఉత్పత్తులను సులభంగా కనుగొనండి",

        productName: "ఉత్పత్తి పేరు",
        quantity: "పరిమాణం",
        expectedPrice: "అంచనా ధర",
        location: "ప్రాంతం",

        generateCatalog: "స్మార్ట్ క్యాటలాగ్ తయారు చేయండి",
        publishProduct: "ఉత్పత్తిని ప్రచురించండి",

        productNeeded: "అవసరమైన ఉత్పత్తి",
        budget: "ఒక్కొక్కటి బడ్జెట్",
        deliveryLocation: "డెలివరీ ప్రాంతం",
        requiredBy: "అవసరమైన తేదీ",

        findMatches: "AI సరిపోలికలను కనుగొనండి",
        requestBuy: "కొనుగోలు అభ్యర్థన"
    },

    "hi-IN": {
        sell: "बेचें",
        buy: "खरीदें",
        orders: "मेरे ऑर्डर",
        about: "हमारे बारे में",

        sellerTitle: "अपना उत्पाद बेचें",
        buyerTitle: "आसानी से उत्पाद खोजें",

        productName: "उत्पाद का नाम",
        quantity: "मात्रा",
        expectedPrice: "अपेक्षित कीमत",
        location: "स्थान",

        generateCatalog: "स्मार्ट कैटलॉग बनाएं",
        publishProduct: "उत्पाद प्रकाशित करें",

        productNeeded: "आवश्यक उत्पाद",
        budget: "प्रति पीस बजट",
        deliveryLocation: "डिलीवरी स्थान",
        requiredBy: "आवश्यक तारीख",

        findMatches: "AI मैच खोजें",
        requestBuy: "खरीदने का अनुरोध"
    },

    "ta-IN": {
        sell: "விற்க",
        buy: "வாங்க",
        orders: "என் ஆர்டர்கள்",
        about: "எங்களைப் பற்றி",

        sellerTitle: "உங்கள் பொருளை விற்கவும்",
        buyerTitle: "பொருட்களை எளிதாக கண்டறியவும்",

        productName: "பொருளின் பெயர்",
        quantity: "அளவு",
        expectedPrice: "எதிர்பார்க்கும் விலை",
        location: "இடம்",

        generateCatalog: "ஸ்மார்ட் பட்டியல் உருவாக்கவும்",
        publishProduct: "பொருளை வெளியிடவும்",

        productNeeded: "தேவையான பொருள்",
        budget: "ஒரு பொருளுக்கான பட்ஜெட்",
        deliveryLocation: "டெலிவரி இடம்",
        requiredBy: "தேவையான தேதி",

        findMatches: "AI பொருத்தங்களை கண்டறியவும்",
        requestBuy: "வாங்க கோரிக்கை"
    },

    "kn-IN": {
        sell: "ಮಾರಾಟ",
        buy: "ಖರೀದಿ",
        orders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
        about: "ನಮ್ಮ ಬಗ್ಗೆ",

        sellerTitle: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟ ಮಾಡಿ",
        buyerTitle: "ಉತ್ಪನ್ನಗಳನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಿ",

        productName: "ಉತ್ಪನ್ನದ ಹೆಸರು",
        quantity: "ಪ್ರಮಾಣ",
        expectedPrice: "ನಿರೀಕ್ಷಿತ ಬೆಲೆ",
        location: "ಸ್ಥಳ",

        generateCatalog: "ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಟಲಾಗ್ ರಚಿಸಿ",
        publishProduct: "ಉತ್ಪನ್ನವನ್ನು ಪ್ರಕಟಿಸಿ",

        productNeeded: "ಬೇಕಾದ ಉತ್ಪನ್ನ",
        budget: "ಪ್ರತಿ ಉತ್ಪನ್ನದ ಬಜೆಟ್",
        deliveryLocation: "ವಿತರಣಾ ಸ್ಥಳ",
        requiredBy: "ಬೇಕಾದ ದಿನಾಂಕ",

        findMatches: "AI ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕಿ",
        requestBuy: "ಖರೀದಿ ವಿನಂತಿ"
    },

    "ml-IN": {
        sell: "വിൽക്കുക",
        buy: "വാങ്ങുക",
        orders: "എന്റെ ഓർഡറുകൾ",
        about: "ഞങ്ങളെക്കുറിച്ച്",

        sellerTitle: "നിങ്ങളുടെ ഉൽപ്പന്നം വിൽക്കുക",
        buyerTitle: "ഉൽപ്പന്നങ്ങൾ എളുപ്പത്തിൽ കണ്ടെത്തുക",

        productName: "ഉൽപ്പന്നത്തിന്റെ പേര്",
        quantity: "അളവ്",
        expectedPrice: "പ്രതീക്ഷിക്കുന്ന വില",
        location: "സ്ഥലം",

        generateCatalog: "സ്മാർട്ട് കാറ്റലോഗ് തയ്യാറാക്കുക",
        publishProduct: "ഉൽപ്പന്നം പ്രസിദ്ധീകരിക്കുക",

        productNeeded: "ആവശ്യമായ ഉൽപ്പന്നം",
        budget: "ഒരു ഉൽപ്പന്നത്തിനുള്ള ബജറ്റ്",
        deliveryLocation: "ഡെലിവറി സ്ഥലം",
        requiredBy: "ആവശ്യമായ തീയതി",

        findMatches: "AI പൊരുത്തങ്ങൾ കണ്ടെത്തുക",
        requestBuy: "വാങ്ങാനുള്ള അഭ്യർത്ഥന"
    }

};


/* ================= CHANGE BUYER LANGUAGE ================= */

function changeLanguage() {

    const select =
        document.getElementById("languageSelect");

    if (!select) return;

    selectedLanguage = select.value;

    localStorage.setItem(
        "agriCraftLanguage",
        selectedLanguage
    );

    applyLanguage(selectedLanguage);

    const status =
        document.getElementById("buyerVoiceStatus");

    if (status) {
        status.textContent =
            "Buyer voice language changed successfully.";
    }
}


/* ================= CHANGE SELLER LANGUAGE ================= */

function changeSellerLanguage() {

    const select =
        document.getElementById("sellerLanguageSelect");

    if (!select) return;

    sellerLanguage = select.value;

    localStorage.setItem(
        "agriCraftSellerLanguage",
        sellerLanguage
    );

    const status =
        document.getElementById("sellerVoiceStatus");

    if (status) {
        status.textContent =
            "Seller voice language changed successfully.";
    }
}


/* ================= CHANGE HOME LANGUAGE ================= */

function changeHomeLanguage() {

    const select =
        document.getElementById("homeLanguageSelect");

    if (!select) return;

    homeLanguage = select.value;

    localStorage.setItem(
        "agriCraftHomeLanguage",
        homeLanguage
    );

    const status =
        document.getElementById("homeVoiceStatus");

    if (status) {
        status.textContent =
            "Home search language changed successfully.";
    }
}


/* ================= APPLY LANGUAGE ================= */

function applyLanguage(language) {

    const t =
        translations[language] ||
        translations["en-IN"];

    const navLinks =
        document.querySelectorAll("#navLinks a");

    if (navLinks.length >= 5) {

        navLinks[0].textContent = "Home";
        navLinks[1].textContent = t.sell;
        navLinks[2].textContent = t.buy;
        navLinks[3].textContent = t.orders;
        navLinks[4].textContent = t.about;
    }

    const sellerHeading =
        document.querySelector("#seller .left-heading h2");

    if (sellerHeading) {
        sellerHeading.textContent = t.sellerTitle;
    }

    const buyerHeading =
        document.querySelector("#buyer .section-heading h2");

    if (buyerHeading) {
        buyerHeading.textContent = t.buyerTitle;
    }

    const sellerLabels =
        document.querySelectorAll("#seller .field-label");

    if (sellerLabels.length >= 4) {

        sellerLabels[0].textContent = "Product Photo";
        sellerLabels[1].textContent = t.productName;
        sellerLabels[2].textContent = t.quantity;
        sellerLabels[3].textContent = t.expectedPrice;
    }

    const sellerLocation =
        document.getElementById("sellerLocation");

    if (sellerLocation) {

        sellerLocation.placeholder =
            language === "te-IN"
                ? "ఉదాహరణ: ఏలూరు"
                : "Example: Eluru";
    }

    const generateButton =
        document.querySelector(
            'button[onclick="generateCatalog()"]'
        );

    if (generateButton) {
        generateButton.textContent =
            t.generateCatalog;
    }

    const publishButton =
        document.querySelector(
            'button[onclick="publishProduct()"]'
        );

    if (publishButton) {
        publishButton.textContent =
            t.publishProduct;
    }

    const buyerLabels =
        document.querySelectorAll("#buyer .field-label");

    if (buyerLabels.length >= 5) {

        buyerLabels[0].textContent =
            "🌐 Select Your Language";

        buyerLabels[1].textContent =
            t.productNeeded;

        buyerLabels[2].textContent =
            t.quantity;

        buyerLabels[3].textContent =
            t.budget;

        buyerLabels[4].textContent =
            t.deliveryLocation;

        if (buyerLabels[5]) {
            buyerLabels[5].textContent =
                t.requiredBy;
        }
    }

    const matchButton =
        document.querySelector(
            'button[onclick="findAIMatches()"]'
        );

    if (matchButton) {
        matchButton.textContent =
            t.findMatches;
    }

    const requestButton =
        document.querySelector(
            'button[onclick="requestToBuy()"]'
        );

    if (requestButton) {
        requestButton.textContent =
            t.requestBuy;
    }
}


/* ================= INITIALIZE PAGE ================= */

function initializePage() {

    const languageSelect =
        document.getElementById("languageSelect");

    if (languageSelect) {
        languageSelect.value = selectedLanguage;
    }

    const sellerLanguageSelect =
        document.getElementById("sellerLanguageSelect");

    if (sellerLanguageSelect) {
        sellerLanguageSelect.value = sellerLanguage;
    }

    const homeLanguageSelect =
        document.getElementById("homeLanguageSelect");

    if (homeLanguageSelect) {
        homeLanguageSelect.value = homeLanguage;
    }

    applyLanguage(selectedLanguage);

    const processing =
        document.getElementById("aiProcessing");

    const catalogResult =
        document.getElementById("catalogResult");

    const catalogEmpty =
        document.getElementById("catalogEmpty");

    const matchCard =
        document.getElementById("matchCard");

    const matchEmpty =
        document.getElementById("matchEmpty");

    if (processing) {
        processing.style.display = "none";
    }

    if (catalogResult) {
        catalogResult.style.display = "none";
    }

    if (catalogEmpty) {
        catalogEmpty.style.display = "block";
    }

    if (matchCard) {
        matchCard.style.display = "none";
    }

    if (matchEmpty) {
        matchEmpty.style.display = "block";
    }
}


/* ================= CATEGORY DETECTION ================= */

function detectCategory(name) {

    const text = normalizeText(name);

    if (
        text.includes("saree") ||
        text.includes("sari") ||
        text.includes("dress") ||
        text.includes("cloth") ||
        text.includes("handloom") ||
        text.includes("cotton") ||
        text.includes("చీర") ||
        text.includes("साड़ी")
    ) {
        return "Handloom & Textile";
    }

    if (
        text.includes("pottery") ||
        text.includes("clay") ||
        text.includes("ceramic") ||
        text.includes("కుండ") ||
        text.includes("मिट्टी")
    ) {
        return "Pottery & Craft";
    }

    if (
        text.includes("basket") ||
        text.includes("bamboo") ||
        text.includes("wood") ||
        text.includes("బుట్ట") ||
        text.includes("बांस")
    ) {
        return "Handicraft";
    }

    if (
        text.includes("honey") ||
        text.includes("pickle") ||
        text.includes("spice") ||
        text.includes("food") ||
        text.includes("తేనె") ||
        text.includes("ఆవకాయ") ||
        text.includes("शहद")
    ) {
        return "Food & Natural Products";
    }

    if (
        text.includes("vegetable") ||
        text.includes("fruit") ||
        text.includes("rice") ||
        text.includes("grain") ||
        text.includes("కూరగాయ") ||
        text.includes("బియ్యం")
    ) {
        return "Agricultural Produce";
    }

    return "Rural Product";
}


/* ================= TAG GENERATION ================= */

function generateTags(name) {

    const text = normalizeText(name);

    const tags = [
        "Handmade",
        "Local"
    ];

    if (
        text.includes("cotton") ||
        text.includes("చీర")
    ) {
        tags.push("Cotton");
    }

    if (
        text.includes("handloom") ||
        text.includes("saree") ||
        text.includes("sari")
    ) {
        tags.push("Handloom");
    }

    if (text.includes("organic")) {
        tags.push("Organic");
    }

    if (
        text.includes("bamboo") ||
        text.includes("బాంబూ")
    ) {
        tags.push("Eco-friendly");
    }

    return tags.join(", ");
}


/* ================= AI CATALOG GENERATION ================= */

function generateCatalog() {

    const name =
        getValue("sellerProductName");

    const quantity =
        getValue("sellerQuantity");

    const price =
        getValue("sellerPrice");

    const location =
        getValue("sellerLocation");

    if (!name) {

        alert("Please enter the product name.");

        document.getElementById(
            "sellerProductName"
        )?.focus();

        return;
    }

    const processing =
        document.getElementById("aiProcessing");

    const catalogResult =
        document.getElementById("catalogResult");

    const catalogEmpty =
        document.getElementById("catalogEmpty");

    if (catalogEmpty) {
        catalogEmpty.style.display = "none";
    }

    if (catalogResult) {
        catalogResult.style.display = "none";
    }

    if (processing) {
        processing.style.display = "flex";
    }

    setTimeout(function () {

        const category =
            detectCategory(name);

        const tags =
            generateTags(name);

        let imageSource =
            "images/craft1.jpg";

        const preview =
            document.getElementById("imagePreview");

        if (
            preview &&
            preview.src &&
            preview.src.startsWith("data:image")
        ) {
            imageSource = preview.src;
        }

        currentCatalog = {

            id: "CAT-" + Date.now(),

            name: name,

            quantity: quantity || "1",

            price: price || "0",

            location: location || "Local",

            category: category,

            tags: tags,

            keywords: createProductKeywords(name),

            image: imageSource,

            description:
                "Traditional rural product created by a local producer with authentic craftsmanship."
        };

        const catalogImage =
            document.getElementById("catalogImage");

        if (catalogImage) {
            catalogImage.src =
                currentCatalog.image;
        }

        setText(
            "catalogName",
            currentCatalog.name
        );

        setText(
            "catalogDescription",
            currentCatalog.description
        );

        setText(
            "catalogCategory",
            "Category: " +
            currentCatalog.category
        );

        setText(
            "catalogTags",
            "Tags: " +
            currentCatalog.tags
        );

        setText(
            "catalogQuantity",
            "Quantity: " +
            currentCatalog.quantity
        );

        setText(
            "catalogPrice",
            "Price: ₹" +
            Number(currentCatalog.price)
                .toLocaleString("en-IN")
        );

        setText(
            "catalogLocation",
            "Location: " +
            currentCatalog.location
        );

        if (processing) {
            processing.style.display = "none";
        }

        if (catalogResult) {
            catalogResult.style.display = "block";
        }

    }, 900);
}


/* ================= PRODUCT KEYWORDS ================= */

function createProductKeywords(name) {

    const text = normalizeText(name);

    const keywordMap = {

        saree: [
            "saree",
            "sari",
            "చీర",
            "చీరలు",
            "साड़ी",
            "cotton",
            "handloom"
        ],

        pottery: [
            "pottery",
            "pot",
            "clay",
            "కుండ",
            "మట్టి",
            "मिट्टी",
            "ceramic"
        ],

        basket: [
            "basket",
            "bamboo",
            "బుట్ట",
            "బాంబూ",
            "बांस",
            "handicraft"
        ],

        honey: [
            "honey",
            "తేనె",
            "मधु",
            "शहद",
            "organic"
        ],

        pickle: [
            "pickle",
            "ఆవకాయ",
            "పచ్చడి",
            "अचार",
            "food"
        ],

        rice: [
            "rice",
            "బియ్యం",
            "चावल",
            "grain"
        ],

        vegetables: [
            "vegetable",
            "vegetables",
            "కూరగాయలు",
            "सब्जी"
        ],

        fruits: [
            "fruit",
            "fruits",
            "పండ్లు",
            "फल"
        ]

    };

    let keywords = [text];

    Object.keys(keywordMap).forEach(function (key) {

        const relatedWords = keywordMap[key];

        const matched = relatedWords.some(function (word) {
            return text.includes(word);
        });

        if (matched) {
            keywords = keywords.concat(relatedWords);
        }

    });

    return [...new Set(keywords)].join(", ");
}


/* ================= PUBLISH PRODUCT ================= */

function publishProduct() {

    if (!currentCatalog) {

        alert(
            "Please generate the Smart Catalog first."
        );

        return;
    }

    let products =
        JSON.parse(
            localStorage.getItem("agriCraftProducts")
        ) || [];

    const product = {

        ...currentCatalog,

        publishedAt:
            new Date().toISOString(),

        seller:
            "Verified Rural Producer"
    };

    products.push(product);

    localStorage.setItem(
        "agriCraftProducts",
        JSON.stringify(products)
    );

    alert(
        "✅ Product published successfully!\n\n" +
        "Product: " +
        product.name
    );

    setTimeout(function () {
        goToBuyer();
    }, 300);
}


/* ================= DEMO PRODUCTS ================= */

function getDemoProducts() {

    return [

        {
            id: "DEMO-001",
            name: "Handwoven Cotton Saree",
            quantity: "20",
            price: "2000",
            location: "Eluru",
            category: "Handloom & Textile",
            tags: "Handmade, Local, Cotton, Handloom",
            keywords:
                "saree, sari, cotton, handloom, చీర, సाड़ी",
            image: "images/craft1.jpg",
            description:
                "Traditional handwoven cotton saree made by a rural artisan."
        },

        {
            id: "DEMO-002",
            name: "Traditional Clay Pottery",
            quantity: "30",
            price: "450",
            location: "Vijayawada",
            category: "Pottery & Craft",
            tags: "Clay, Handmade, Traditional",
            keywords:
                "pottery, clay, pot, ceramic, కుండ, మట్టి",
            image: "images/pottery.jpg",
            description:
                "Beautiful handmade clay pottery created by local artisans."
        },

        {
            id: "DEMO-003",
            name: "Bamboo Handmade Basket",
            quantity: "15",
            price: "350",
            location: "Rajahmundry",
            category: "Handicraft",
            tags: "Bamboo, Handmade, Eco-friendly",
            keywords:
                "basket, bamboo, handicraft, బుట్ట, బాంబూ",
            image: "images/basket.jpg",
            description:
                "Eco-friendly bamboo basket made using traditional techniques."
        },

        {
            id: "DEMO-004",
            name: "Natural Organic Honey",
            quantity: "25",
            price: "600",
            location: "Hyderabad",
            category: "Food & Natural Products",
            tags: "Honey, Organic, Natural",
            keywords:
                "honey, organic, natural, తేనె, శహద్",
            image: "images/honey.jpg",
            description:
                "Pure natural honey collected from local beekeepers."
        },

        {
            id: "DEMO-005",
            name: "Homemade Mango Pickle",
            quantity: "40",
            price: "250",
            location: "Guntur",
            category: "Food & Natural Products",
            tags: "Pickle, Homemade, Food",
            keywords:
                "pickle, mango pickle, ఆవకాయ, పచ్చడి, అचार",
            image: "images/pickle.jpg",
            description:
                "Traditional homemade mango pickle prepared with authentic spices."
        }

    ];
}


/* ================= PRODUCT MATCH SCORE ================= */

function calculateProductScore(
    product,
    requestedProduct,
    budget,
    buyerLocation
) {

    const request =
        normalizeText(requestedProduct);

    const productName =
        normalizeText(product.name);

    const productTags =
        normalizeText(product.tags);

    const productKeywords =
        normalizeText(product.keywords);

    const productCategory =
        normalizeText(product.category);

    const productLocation =
        normalizeText(product.location);

    let score = 0;

    if (!request) {
        return 0;
    }

    if (
        productName === request ||
        request === productName
    ) {
        score += 100;
    }

    if (
        productName.includes(request) ||
        request.includes(productName)
    ) {
        score += 60;
    }

    const requestWords =
        request.split(/\s+/);

    requestWords.forEach(function (word) {

        if (word.length < 2) return;

        if (productName.includes(word)) {
            score += 25;
        }

        if (productTags.includes(word)) {
            score += 20;
        }

        if (productKeywords.includes(word)) {
            score += 25;
        }

        if (productCategory.includes(word)) {
            score += 15;
        }

    });

    if (budget) {

        const productPrice =
            Number(product.price) || 0;

        if (productPrice <= Number(budget)) {
            score += 15;
        } else {
            score -= 10;
        }
    }

    if (buyerLocation) {

        const requestedLocation =
            normalizeText(buyerLocation);

        if (
            productLocation.includes(requestedLocation) ||
            requestedLocation.includes(productLocation)
        ) {
            score += 20;
        }
    }

    return score;
}


/* ================= HOME SEARCH ================= */

function searchFromHome() {

    const homeSearch =
        getValue("homeSearchInput");

    if (!homeSearch) {

        alert(
            "Please type or speak a product name first."
        );

        document.getElementById(
            "homeSearchInput"
        )?.focus();

        return;
    }

    setValue(
        "buyerProduct",
        homeSearch
    );

    scrollToSection("buyer");

    setTimeout(function () {
        findAIMatches();
    }, 500);
}


/* ================= AI PRODUCT MATCHING ================= */

function findAIMatches() {

    const requestedProduct =
        getValue("buyerProduct");

    const requestedQuantity =
        getValue("buyerQuantity");

    const budget =
        getValue("buyerBudget");

    const buyerLocation =
        getValue("buyerLocation");

    if (!requestedProduct) {

        alert(
            "Please enter the product you are looking for."
        );

        document.getElementById(
            "buyerProduct"
        )?.focus();

        return;
    }

    const publishedProducts =
        JSON.parse(
            localStorage.getItem("agriCraftProducts")
        ) || [];

    const demoProducts =
        getDemoProducts();

    const allProducts = [
        ...publishedProducts,
        ...demoProducts
    ];

    let bestProduct = null;
    let bestScore = 0;

    allProducts.forEach(function (product) {

        const score =
            calculateProductScore(
                product,
                requestedProduct,
                budget,
                buyerLocation
            );

        if (score > bestScore) {
            bestScore = score;
            bestProduct = product;
        }

    });

    const matchCard =
        document.getElementById("matchCard");

    const matchEmpty =
        document.getElementById("matchEmpty");

    /*
     * No matching product found
     */

    if (!bestProduct || bestScore <= 0) {

        currentMatch = null;

        if (matchCard) {
            matchCard.style.display = "none";
        }

        if (matchEmpty) {
            matchEmpty.style.display = "block";
            matchEmpty.innerHTML = `
                <div class="empty-message">
                    <h3>🔍 No Matching Product Found</h3>
                    <p>
                        We could not find a product matching
                        "${escapeHTML(requestedProduct)}".
                    </p>
                    <p>
                        Try searching for saree, pottery,
                        basket, honey or pickle.
                    </p>
                </div>
            `;
        }

        return;
    }

    currentMatch = {

        ...bestProduct,

        requestedQuantity:
            requestedQuantity || "1",

        requestedBudget:
            budget || "",

        buyerLocation:
            buyerLocation || "",

        requiredBy:
            getValue("buyerDate"),

        matchScore:
            Math.min(100, bestScore)
    };

    const matchImage =
        document.getElementById(
            "matchedProductImage"
        );

    if (matchImage) {

        matchImage.src =
            currentMatch.image ||
            "images/craft1.jpg";

        matchImage.onerror = function () {
            this.src = "images/craft1.jpg";
        };
    }

    setText(
        "matchedProductName",
        currentMatch.name
    );

    setText(
        "matchedProductDescription",
        currentMatch.description ||
        "Verified rural producer product."
    );

    const details =
        document.getElementById(
            "matchedProductDetails"
        );

    if (details) {

        details.innerHTML = `

            <span>
                📦 ${escapeHTML(
                    currentMatch.quantity || "Available"
                )} pieces
            </span>

            <span>
                ₹${Number(currentMatch.price || 0)
                    .toLocaleString("en-IN")} / piece
            </span>

            <span>
                📍 ${escapeHTML(
                    currentMatch.location || "Local"
                )}
            </span>

        `;
    }

    if (matchEmpty) {
        matchEmpty.style.display = "none";
    }

    if (matchCard) {
        matchCard.style.display = "block";
    }
}


/* ================= REQUEST TO BUY ================= */

function requestToBuy() {

    if (!currentMatch) {

        alert(
            "Please find an AI match first."
        );

        return;
    }

    const buyerProduct =
        getValue("buyerProduct");

    const buyerQuantity =
        Number(
            getValue("buyerQuantity")
        ) || 1;

    const buyerBudget =
        Number(
            getValue("buyerBudget")
        ) || Number(currentMatch.price) || 0;

    const buyerLocation =
        getValue("buyerLocation");

    const requiredBy =
        getValue("buyerDate");

    const unitPrice =
        Number(currentMatch.price) || 0;

    const totalAmount =
        unitPrice * buyerQuantity;

    const orderId =
        "AC-" +
        Date.now().toString().slice(-8);

    const order = {

        id: orderId,

        productName:
            currentMatch.name,

        productImage:
            currentMatch.image ||
            "images/craft1.jpg",

        sellerLocation:
            currentMatch.location,

        buyerProduct:
            buyerProduct,

        quantity:
            buyerQuantity,

        budget:
            buyerBudget,

        unitPrice:
            unitPrice,

        total:
            totalAmount,

        buyerLocation:
            buyerLocation || "Not specified",

        requiredBy:
            requiredBy || "Not specified",

        status:
            "Order Confirmed",

        trackingStep:
            1,

        createdAt:
            new Date().toISOString()
    };

    let orders =
        JSON.parse(
            localStorage.getItem("agriCraftOrders")
        ) || [];

    orders.push(order);

    localStorage.setItem(
        "agriCraftOrders",
        JSON.stringify(orders)
    );

    localStorage.setItem(
        "myBookings",
        JSON.stringify(orders)
    );

    alert(
        "✅ Order request submitted successfully!\n\n" +
        "Order ID: " +
        orderId +
        "\n" +
        "Product: " +
        order.productName
    );

    showVerifiedOrder();

    setTimeout(function () {
        scrollToSection("orders");
    }, 300);
}


/* ================= GET ORDERS ================= */

function getOrders() {

    return JSON.parse(
        localStorage.getItem("agriCraftOrders")
    ) || [];

}


/* ================= SHOW BUYER REQUESTS ================= */

function showOrderRequests() {

    const orders =
        getOrders();

    const output =
        document.getElementById("orderOutput");

    if (!output) return;

    if (orders.length === 0) {

        output.innerHTML = `

            <div class="empty-message">

                <h3>📩 No Buyer Requests Yet</h3>

                <p>
                    Buyer requests will appear here
                    after a buyer places an order.
                </p>

            </div>

        `;

        return;
    }

    output.innerHTML = `

        <div class="generated-orders">

            <h3>📩 Buyer Requests</h3>

            ${orders.map(function (order) {

                return `

                    <div class="generated-order-card">

                        <div>

                            <strong>
                                ${escapeHTML(order.productName)}
                            </strong>

                            <p>
                                Quantity:
                                ${escapeHTML(order.quantity)}
                            </p>

                            <p>
                                Buyer Location:
                                ${escapeHTML(order.buyerLocation)}
                            </p>

                            <p>
                                Required By:
                                ${escapeHTML(order.requiredBy)}
                            </p>

                        </div>

                        <span class="verified-tag">
                            ${escapeHTML(order.status)}
                        </span>

                        <button
                            class="btn secondary"
                            type="button"
                            onclick="trackOrder('${escapeHTML(order.id)}')"
                        >
                            Track Order
                        </button>

                    </div>

                `;

            }).join("")}

        </div>

    `;

}


/* ================= SHOW VERIFIED ORDER ================= */

function showVerifiedOrder() {

    const orders =
        getOrders();

    const output =
        document.getElementById("orderOutput");

    if (!output) return;

    if (orders.length === 0) {

        output.innerHTML = `

            <div class="empty-message">

                <h3>🧾 No Verified Orders</h3>

                <p>
                    Your confirmed order receipt
                    will appear here.
                </p>

            </div>

        `;

        return;
    }

    const order =
        orders[orders.length - 1];

    output.innerHTML = `

        <div class="receipt-card">

            <div class="receipt-header">

                <div>

                    <span class="eyebrow">
                        VERIFIED ORDER
                    </span>

                    <h3>
                        🧾 Digital Order Receipt
                    </h3>

                </div>

                <strong>
                    ${escapeHTML(order.id)}
                </strong>

            </div>

            <div class="receipt-body">

                <div class="receipt-product">

                    <img
                        src="${escapeHTML(order.productImage)}"
                        alt="Product"
                    >

                    <div>

                        <h3>
                            ${escapeHTML(order.productName)}
                        </h3>

                        <p>
                            Rural Verified Producer
                        </p>

                    </div>

                </div>

                <div class="receipt-details">

                    <p>
                        <strong>Quantity:</strong>
                        ${escapeHTML(order.quantity)}
                    </p>

                    <p>
                        <strong>Price per Piece:</strong>
                        ₹${Number(order.unitPrice)
                            .toLocaleString("en-IN")}
                    </p>

                    <p>
                        <strong>Total Amount:</strong>
                        ₹${Number(order.total)
                            .toLocaleString("en-IN")}
                    </p>

                    <p>
                        <strong>Delivery Location:</strong>
                        ${escapeHTML(order.buyerLocation)}
                    </p>

                    <p>
                        <strong>Required By:</strong>
                        ${escapeHTML(order.requiredBy)}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        <span class="verified-tag">
                            ${escapeHTML(order.status)}
                        </span>
                    </p>

                </div>

            </div>

            <div class="receipt-actions">

                <button
                    class="btn primary"
                    type="button"
                    onclick="trackOrder('${escapeHTML(order.id)}')"
                >
                    📦 Track Order
                </button>

            </div>

        </div>

    `;

}


/* ================= TRACK ORDER ================= */

function trackOrder(orderId) {

    const orders =
        getOrders();

    const order =
        orders.find(function (item) {
            return item.id === orderId;
        });

    const output =
        document.getElementById("orderOutput");

    if (!order || !output) return;

    const steps = [

        {
            title: "Order Confirmed",
            icon: "✅"
        },

        {
            title: "Seller Processing",
            icon: "📦"
        },

        {
            title: "Ready for Delivery",
            icon: "🚚"
        },

        {
            title: "Delivered",
            icon: "🏠"
        }

    ];

    output.innerHTML = `

        <div class="tracking-card">

            <div class="tracking-header">

                <span class="eyebrow">
                    ORDER TRACKING
                </span>

                <h3>
                    📦 Track Order
                </h3>

                <p>
                    Order ID:
                    <strong>
                        ${escapeHTML(order.id)}
                    </strong>
                </p>

            </div>

            <div class="tracking-product">

                <img
                    src="${escapeHTML(order.productImage)}"
                    alt="Product"
                >

                <div>

                    <h3>
                        ${escapeHTML(order.productName)}
                    </h3>

                    <p>
                        Quantity:
                        ${escapeHTML(order.quantity)}
                    </p>

                    <p>
                        Delivery:
                        ${escapeHTML(order.buyerLocation)}
                    </p>

                </div>

            </div>

            <div class="tracking-timeline">

                ${steps.map(function (step, index) {

                    const completed =
                        index <=
                        (order.trackingStep || 1) - 1;

                    return `

                        <div class="
                            tracking-step
                            ${completed ? "completed" : ""}
                        ">

                            <div class="tracking-icon">
                                ${step.icon}
                            </div>

                            <div>

                                <strong>
                                    ${step.title}
                                </strong>

                                <small>
                                    ${
                                        completed
                                            ? "Completed"
                                            : "Pending"
                                    }
                                </small>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

            <div class="tracking-status">

                <strong>
                    Current Status:
                </strong>

                ${escapeHTML(order.status)}

            </div>

        </div>

    `;

}


/* ================= DELETE ORDERS ================= */

function clearOrders() {

    localStorage.removeItem("agriCraftOrders");
    localStorage.removeItem("myBookings");

    alert(
        "All saved orders have been cleared."
    );

    showVerifiedOrder();
}


/* ================= MODAL ================= */

function openModal(content) {

    const overlay =
        document.getElementById("modalOverlay");

    const modalContent =
        document.getElementById("modalContent");

    if (!overlay || !modalContent) return;

    modalContent.innerHTML = content;

    overlay.classList.add("active");
    overlay.style.display = "flex";
}


function closeModal() {

    const overlay =
        document.getElementById("modalOverlay");

    if (!overlay) return;

    overlay.classList.remove("active");
    overlay.style.display = "none";
}


/* ================= MODAL OUTSIDE CLICK ================= */

document.addEventListener("click", function (event) {

    const overlay =
        document.getElementById("modalOverlay");

    if (
        overlay &&
        event.target === overlay
    ) {
        closeModal();
    }

});


/* ================= EXPORT GLOBAL FUNCTIONS ================= */

window.goToSeller = goToSeller;
window.goToBuyer = goToBuyer;

window.startSellerVoice = startSellerVoice;
window.startBuyerVoice = startBuyerVoice;
window.startHomeVoice = startHomeVoice;

window.changeLanguage = changeLanguage;
window.changeSellerLanguage = changeSellerLanguage;
window.changeHomeLanguage = changeHomeLanguage;

window.searchFromHome = searchFromHome;

window.generateCatalog = generateCatalog;
window.publishProduct = publishProduct;

window.findAIMatches = findAIMatches;
window.requestToBuy = requestToBuy;

window.showOrderRequests = showOrderRequests;
window.showVerifiedOrder = showVerifiedOrder;

window.trackOrder = trackOrder;
window.clearOrders = clearOrders;

window.openModal = openModal;
window.closeModal = closeModal;
