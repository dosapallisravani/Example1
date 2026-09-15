/* =====================================================
   AGRICRAFT CONNECT - UPDATED MAIN.JS
===================================================== */

let selectedLanguage = "en";
let sellerLanguage = "en";
let currentCatalog = null;
let currentMatch = null;

/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
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

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "");
}

function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =====================================================
   HERO BUTTONS
===================================================== */

function goToSeller() {
  const sellerSection =
    document.getElementById("sellerSection") ||
    document.getElementById("seller") ||
    document.getElementById("sellerDashboard");

  if (sellerSection) {
    sellerSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } else {
    window.location.hash = "sellerSection";
  }
}

function goToBuyer() {
  const buyerSection =
    document.getElementById("buyerSection") ||
    document.getElementById("buyer") ||
    document.getElementById("buyerDashboard");

  if (buyerSection) {
    buyerSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } else {
    window.location.hash = "buyerSection";
  }
}

/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupImagePreview();
  initializePage();
  loadSavedProducts();
  showOrderRequests();
});

/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {
  const menuButton =
    document.getElementById("menuButton") ||
    document.querySelector(".menu-toggle") ||
    document.querySelector(".hamburger");

  const navMenu =
    document.getElementById("navMenu") ||
    document.querySelector(".nav-links") ||
    document.querySelector("nav ul");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }
}

/* =====================================================
   IMAGE PREVIEW
===================================================== */

function setupImagePreview() {
  const imageInput =
    document.getElementById("productImage") ||
    document.getElementById("imageUpload") ||
    document.querySelector('input[type="file"]');

  const imagePreview =
    document.getElementById("imagePreview") ||
    document.querySelector(".image-preview");

  if (!imageInput) return;

  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      if (imagePreview) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      }

      const previewContainer =
        document.getElementById("previewContainer");

      if (previewContainer) {
        previewContainer.style.display = "block";
      }
    };

    reader.readAsDataURL(file);
  });
}

/* =====================================================
   VOICE RECOGNITION
===================================================== */

function createVoiceRecognition(inputId, language = "en-IN") {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition is not supported in this browser.");
    return;
  }

  const input = document.getElementById(inputId);

  if (!input) return;

  const recognition = new SpeechRecognition();

  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
  };

  recognition.onerror = function () {
    alert("Voice input could not be detected. Please try again.");
  };

  recognition.start();
}

function startSellerVoice() {
  createVoiceRecognition("productName", "en-IN");
}

function startBuyerVoice() {
  createVoiceRecognition("buyerRequirement", "en-IN");
}

/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {
  en: {
    home: "Home",
    about: "About",
    seller: "Seller",
    buyer: "Buyer",
    contact: "Contact",
    heroTitle: "Connect Farmers, Craftsmen and Buyers",
    heroDescription:
      "Discover authentic handmade products and connect directly with trusted sellers.",
    sellerButton: "Start Selling",
    buyerButton: "Find Products",
    sellerTitle: "Seller Dashboard",
    buyerTitle: "Buyer Dashboard",
    productName: "Product Name",
    productDescription: "Product Description",
    productPrice: "Product Price",
    publish: "Publish Product",
    search: "Search",
    searchPlaceholder: "Search for products...",
    noProducts: "No products found.",
    requestBuy: "Request to Buy",
    available: "Available",
    category: "Category",
    price: "Price",
    location: "Location",
    languageChanged: "Language changed successfully."
  },

  te: {
    home: "హోమ్",
    about: "మా గురించి",
    seller: "విక్రేత",
    buyer: "కొనుగోలుదారు",
    contact: "సంప్రదించండి",
    heroTitle: "రైతులు, కళాకారులు మరియు కొనుగోలుదారులను కలుపుదాం",
    heroDescription:
      "నమ్మకమైన విక్రేతల నుండి ప్రత్యేకమైన చేతిపనులను కనుగొనండి.",
    sellerButton: "విక్రయించడం ప్రారంభించండి",
    buyerButton: "ఉత్పత్తులను వెతకండి",
    sellerTitle: "విక్రేత డ్యాష్‌బోర్డ్",
    buyerTitle: "కొనుగోలుదారు డ్యాష్‌బోర్డ్",
    productName: "ఉత్పత్తి పేరు",
    productDescription: "ఉత్పత్తి వివరణ",
    productPrice: "ఉత్పత్తి ధర",
    publish: "ఉత్పత్తిని ప్రచురించండి",
    search: "వెతకండి",
    searchPlaceholder: "ఉత్పత్తుల కోసం వెతకండి...",
    noProducts: "ఉత్పత్తులు కనుగొనబడలేదు.",
    requestBuy: "కొనుగోలు అభ్యర్థన",
    available: "అందుబాటులో ఉంది",
    category: "వర్గం",
    price: "ధర",
    location: "ప్రాంతం",
    languageChanged: "భాష విజయవంతంగా మార్చబడింది."
  },

  hi: {
    home: "होम",
    about: "हमारे बारे में",
    seller: "विक्रेता",
    buyer: "खरीदार",
    contact: "संपर्क करें",
    heroTitle: "किसानों, कारीगरों और खरीदारों को जोड़ना",
    heroDescription:
      "विश्वसनीय विक्रेताओं से प्रामाणिक हस्तनिर्मित उत्पाद खोजें।",
    sellerButton: "बेचना शुरू करें",
    buyerButton: "उत्पाद खोजें",
    sellerTitle: "विक्रेता डैशबोर्ड",
    buyerTitle: "खरीदार डैशबोर्ड",
    productName: "उत्पाद का नाम",
    productDescription: "उत्पाद का विवरण",
    productPrice: "उत्पाद की कीमत",
    publish: "उत्पाद प्रकाशित करें",
    search: "खोजें",
    searchPlaceholder: "उत्पाद खोजें...",
    noProducts: "कोई उत्पाद नहीं मिला।",
    requestBuy: "खरीदने का अनुरोध",
    available: "उपलब्ध",
    category: "श्रेणी",
    price: "कीमत",
    location: "स्थान",
    languageChanged: "भाषा सफलतापूर्वक बदल दी गई।"
  },

  ta: {
    home: "முகப்பு",
    about: "எங்களை பற்றி",
    seller: "விற்பனையாளர்",
    buyer: "வாங்குபவர்",
    contact: "தொடர்பு",
    heroTitle: "விவசாயிகள், கைவினைஞர்கள் மற்றும் வாங்குபவர்களை இணைத்தல்",
    heroDescription:
      "நம்பகமான விற்பனையாளர்களிடமிருந்து கைவினைப் பொருட்களை கண்டறியுங்கள்.",
    sellerButton: "விற்பனை தொடங்குங்கள்",
    buyerButton: "பொருட்களை தேடுங்கள்",
    sellerTitle: "விற்பனையாளர் பகுதி",
    buyerTitle: "வாங்குபவர் பகுதி",
    productName: "பொருளின் பெயர்",
    productDescription: "பொருள் விளக்கம்",
    productPrice: "பொருள் விலை",
    publish: "பொருளை வெளியிடுங்கள்",
    search: "தேடல்",
    searchPlaceholder: "பொருட்களை தேடுங்கள்...",
    noProducts: "பொருட்கள் எதுவும் கிடைக்கவில்லை.",
    requestBuy: "வாங்க கோரிக்கை",
    available: "கிடைக்கிறது",
    category: "வகை",
    price: "விலை",
    location: "இடம்",
    languageChanged: "மொழி வெற்றிகரமாக மாற்றப்பட்டது."
  },

  kn: {
    home: "ಮುಖಪುಟ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    seller: "ಮಾರಾಟಗಾರ",
    buyer: "ಖರೀದಿದಾರ",
    contact: "ಸಂಪರ್ಕಿಸಿ",
    heroTitle: "ರೈತರು, ಕುಶಲಕರ್ಮಿಗಳು ಮತ್ತು ಖರೀದಿದಾರರನ್ನು ಸಂಪರ್ಕಿಸುವುದು",
    heroDescription:
      "ವಿಶ್ವಾಸಾರ್ಹ ಮಾರಾಟಗಾರರಿಂದ ಕೈಯಿಂದ ತಯಾರಿಸಿದ ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ.",
    sellerButton: "ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ",
    buyerButton: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ",
    sellerTitle: "ಮಾರಾಟಗಾರರ ವಿಭಾಗ",
    buyerTitle: "ಖರೀದಿದಾರರ ವಿಭಾಗ",
    productName: "ಉತ್ಪನ್ನದ ಹೆಸರು",
    productDescription: "ಉತ್ಪನ್ನ ವಿವರಣೆ",
    productPrice: "ಉತ್ಪನ್ನದ ಬೆಲೆ",
    publish: "ಉತ್ಪನ್ನ ಪ್ರಕಟಿಸಿ",
    search: "ಹುಡುಕಿ",
    searchPlaceholder: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...",
    noProducts: "ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    requestBuy: "ಖರೀದಿ ವಿನಂತಿ",
    available: "ಲಭ್ಯವಿದೆ",
    category: "ವರ್ಗ",
    price: "ಬೆಲೆ",
    location: "ಸ್ಥಳ",
    languageChanged: "ಭಾಷೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ."
  },

  ml: {
    home: "ഹോം",
    about: "ഞങ്ങളെക്കുറിച്ച്",
    seller: "വിൽപ്പനക്കാരൻ",
    buyer: "വാങ്ങുന്നയാൾ",
    contact: "ബന്ധപ്പെടുക",
    heroTitle: "കർഷകരെയും കരകൗശല വിദഗ്ധരെയും വാങ്ങുന്നവരെയും ബന്ധിപ്പിക്കുന്നു",
    heroDescription:
      "വിശ്വസനീയമായ വിൽപ്പനക്കാരിൽ നിന്ന് കൈകൊണ്ട് നിർമ്മിച്ച ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തുക.",
    sellerButton: "വിൽപ്പന ആരംഭിക്കുക",
    buyerButton: "ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തുക",
    sellerTitle: "വിൽപ്പനക്കാരുടെ വിഭാഗം",
    buyerTitle: "വാങ്ങുന്നവരുടെ വിഭാഗം",
    productName: "ഉൽപ്പന്നത്തിന്റെ പേര്",
    productDescription: "ഉൽപ്പന്ന വിവരണം",
    productPrice: "ഉൽപ്പന്ന വില",
    publish: "ഉൽപ്പന്നം പ്രസിദ്ധീകരിക്കുക",
    search: "തിരയുക",
    searchPlaceholder: "ഉൽപ്പന്നങ്ങൾ തിരയുക...",
    noProducts: "ഉൽപ്പന്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല.",
    requestBuy: "വാങ്ങാനുള്ള അഭ്യർത്ഥന",
    available: "ലഭ്യമാണ്",
    category: "വിഭാഗം",
    price: "വില",
    location: "സ്ഥലം",
    languageChanged: "ഭാഷ വിജയകരമായി മാറ്റി."
  }
};

/* =====================================================
   LANGUAGE CHANGE
===================================================== */

function changeNavbarLanguage(language) {
  selectedLanguage = language || "en";
  applyLanguage(selectedLanguage);
}

function changeSellerLanguage(language) {
  sellerLanguage = language || "en";
  applyLanguage(sellerLanguage);
}

function applyLanguage(language) {
  const data = translations[language] || translations.en;

  /* Navigation */
  document.querySelectorAll("[data-translate]").forEach(function (element) {
    const key = element.getAttribute("data-translate");

    if (data[key]) {
      element.textContent = data[key];
    }
  });

  /* Hero content */
  setText("heroTitle", data.heroTitle);
  setText("heroDescription", data.heroDescription);
  setText("sellerHeroButton", data.sellerButton);
  setText("buyerHeroButton", data.buyerButton);

  /* Section headings */
  setText("sellerTitle", data.sellerTitle);
  setText("buyerTitle", data.buyerTitle);

  /* Labels */
  setText("productNameLabel", data.productName);
  setText("productDescriptionLabel", data.productDescription);
  setText("productPriceLabel", data.productPrice);

  /* Buttons */
  setText("publishButton", data.publish);
  setText("searchButton", data.search);

  /* Search placeholder */
  const searchInput =
    document.getElementById("buyerRequirement") ||
    document.getElementById("searchInput");

  if (searchInput) {
    searchInput.placeholder = data.searchPlaceholder;
  }
}

function initializePage() {
  const languageSelect =
    document.getElementById("navbarLanguageSelect") ||
    document.getElementById("languageSelect");

  if (languageSelect) {
    languageSelect.value = selectedLanguage;

    languageSelect.addEventListener("change", function () {
      changeNavbarLanguage(this.value);
    });
  }

  applyLanguage(selectedLanguage);
}

/* =====================================================
   PRODUCT CATEGORY DETECTION
===================================================== */

function detectCategory(productName) {
  const text = normalizeText(productName);

  const potteryWords = [
    "pottery",
    "pot",
    "clay",
    "ceramic",
    "terracotta",
    "diya",
    "diyas",
    "matka",
    "handi",
    "mud pot",
    "కుండ",
    "మట్టి",
    "మట్టి కుండ",
    "मिट्टी",
    "बर्तन",
    "களிமண்",
    "ಮಣ್ಣಿನ",
    "മൺപാത്രം"
  ];

  const basketWords = [
    "basket",
    "bamboo basket",
    "bamboo",
    "wicker",
    "cane",
    "handwoven basket",
    "బుట్ట",
    "వెదురు",
    "बांस",
    "टोकरी",
    "கூடை",
    "ಬುಟ್ಟಿ",
    "കൊട്ട"
  ];

  const textileWords = [
    "saree",
    "sari",
    "shawl",
    "scarf",
    "dress",
    "cloth",
    "cotton",
    "handloom",
    "textile",
    "చీర",
    "దుపట్టా",
    "వస్త్రం",
    "साड़ी",
    "कपड़ा",
    "புடவை",
    "ಸೀರೆ",
    "സാരി"
  ];

  const jewelryWords = [
    "jewellery",
    "jewelry",
    "necklace",
    "earrings",
    "bangles",
    "bracelet",
    "ring",
    "చెవి దిద్దులు",
    "హారం",
    "गहना",
    "हार",
    "நகை",
    "ಆಭರಣ",
    "ആഭരണം"
  ];

  const foodWords = [
    "pickle",
    "honey",
    "spice",
    "spices",
    "organic",
    "food",
    "rice",
    "millet",
    "turmeric",
    "పచ్చడి",
    "తేనె",
    "సుగంధ ద్రవ్యాలు",
    "अचार",
    "शहद",
    "மசாலா",
    "ಜೇನುತುಪ್ಪ",
    "അച്ചാർ"
  ];

  if (potteryWords.some(word => text.includes(normalizeText(word)))) {
    return "pottery";
  }

  if (basketWords.some(word => text.includes(normalizeText(word)))) {
    return "basket";
  }

  if (textileWords.some(word => text.includes(normalizeText(word)))) {
    return "textile";
  }

  if (jewelryWords.some(word => text.includes(normalizeText(word)))) {
    return "jewelry";
  }

  if (foodWords.some(word => text.includes(normalizeText(word)))) {
    return "food";
  }

  return "craft";
}

/* =====================================================
   DIFFERENT PRODUCT IMAGES
===================================================== */

function getProductImage(productName) {
  const category = detectCategory(productName);

  const imageMap = {
    pottery: "images/craft1.jpg",
    basket: "images/craft2.jpg",
    textile: "images/craft3.jpg",
    jewelry: "images/craft4.jpg",
    food: "images/craft5.jpg",
    craft: "images/craft6.jpg"
  };

  return imageMap[category] || "images/craft6.jpg";
}

/* =====================================================
   PRODUCT TAGS
===================================================== */

function generateTags(productName, description = "") {
  const category = detectCategory(productName);

  const categoryTags = {
    pottery: ["Handmade", "Clay", "Traditional", "Eco-friendly"],
    basket: ["Bamboo", "Handwoven", "Natural", "Eco-friendly"],
    textile: ["Handloom", "Cotton", "Traditional", "Artisan-made"],
    jewelry: ["Handcrafted", "Unique", "Traditional", "Artisan-made"],
    food: ["Organic", "Natural", "Homemade", "Fresh"],
    craft: ["Handmade", "Artisan-made", "Traditional", "Unique"]
  };

  const baseTags = categoryTags[category] || categoryTags.craft;

  const words = normalizeText(
    productName + " " + description
  ).split(" ");

  const extraTags = [];

  words.forEach(function (word) {
    if (
      word.length > 3 &&
      !baseTags.map(tag => normalizeText(tag)).includes(word)
    ) {
      extraTags.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
  });

  return [...new Set([...baseTags, ...extraTags])].slice(0, 6);
}

/* =====================================================
   PRODUCT KEYWORDS
===================================================== */

function createProductKeywords(name, description = "") {
  const category = detectCategory(name);

  const keywords = [
    normalizeText(name),
    normalizeText(description),
    category,
    ...generateTags(name, description).map(tag => normalizeText(tag))
  ];

  return [...new Set(keywords.filter(Boolean))];
}

/* =====================================================
   AI CATALOG GENERATION
===================================================== */

function generateCatalog() {
  const name =
    getValue("productName") ||
    getValue("productTitle");

  const description =
    getValue("productDescription") ||
    getValue("description");

  const price =
    getValue("productPrice") ||
    getValue("price");

  const location =
    getValue("sellerLocation") ||
    getValue("location") ||
    "India";

  if (!name) {
    alert("Please enter a product name.");
    return;
  }

  const category = detectCategory(name);
  const tags = generateTags(name, description);
  const keywords = createProductKeywords(name, description);

  const imageInput =
    document.getElementById("productImage") ||
    document.getElementById("imageUpload") ||
    document.querySelector('input[type="file"]');

  const file = imageInput && imageInput.files
    ? imageInput.files[0]
    : null;

  function createCatalog(imageSource) {
    currentCatalog = {
      id: Date.now(),
      name: name,
      description: description || "Handcrafted quality product.",
      price: price || "Contact seller",
      location: location,
      category: category,
      tags: tags,
      keywords: keywords,
      image: imageSource,
      seller: "Local Artisan",
      status: "Available",
      createdAt: new Date().toISOString()
    };

    displayGeneratedCatalog(currentCatalog);
  }

  if (file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      createCatalog(event.target.result);
    };

    reader.readAsDataURL(file);
  } else {
    createCatalog(getProductImage(name));
  }
}

/* =====================================================
   DISPLAY GENERATED CATALOG
===================================================== */

function displayGeneratedCatalog(product) {
  const catalogContainer =
    document.getElementById("catalogResult") ||
    document.getElementById("generatedCatalog") ||
    document.querySelector(".catalog-result");

  if (!catalogContainer) {
    alert("Catalog generated successfully.");
    return;
  }

  catalogContainer.innerHTML = `
    <div class="generated-product-card">
      <img
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}"
        class="generated-product-image"
      />

      <div class="generated-product-content">
        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h3>${escapeHTML(product.name)}</h3>

        <p>${escapeHTML(product.description)}</p>

        <p>
          <strong>Price:</strong>
          ₹${escapeHTML(product.price)}
        </p>

        <p>
          <strong>Location:</strong>
          ${escapeHTML(product.location)}
        </p>

        <div class="product-tags">
          ${product.tags
            .map(tag => `<span>${escapeHTML(tag)}</span>`)
            .join("")}
        </div>

        <button onclick="publishProduct()" class="primary-button">
          Publish Product
        </button>
      </div>
    </div>
  `;

  catalogContainer.style.display = "block";
}

/* =====================================================
   PUBLISH PRODUCT
===================================================== */

function publishProduct() {
  if (!currentCatalog) {
    generateCatalog();
    return;
  }

  const products = JSON.parse(
    localStorage.getItem("agriCraftProducts") || "[]"
  );

  products.push(currentCatalog);

  localStorage.setItem(
    "agriCraftProducts",
    JSON.stringify(products)
  );

  alert("Product published successfully!");

  currentCatalog = null;

  const catalogContainer =
    document.getElementById("catalogResult") ||
    document.getElementById("generatedCatalog");

  if (catalogContainer) {
    catalogContainer.innerHTML = "";
    catalogContainer.style.display = "none";
  }

  clearSellerForm();
  loadSavedProducts();
}

/* =====================================================
   CLEAR SELLER FORM
===================================================== */

function clearSellerForm() {
  [
    "productName",
    "productTitle",
    "productDescription",
    "description",
    "productPrice",
    "price",
    "sellerLocation",
    "location"
  ].forEach(function (id) {
    setValue(id, "");
  });

  const imageInput =
    document.getElementById("productImage") ||
    document.getElementById("imageUpload");

  if (imageInput) {
    imageInput.value = "";
  }

  const imagePreview =
    document.getElementById("imagePreview");

  if (imagePreview) {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
}

/* =====================================================
   LOAD SAVED PRODUCTS
===================================================== */

function loadSavedProducts() {
  const products = JSON.parse(
    localStorage.getItem("agriCraftProducts") || "[]"
  );

  displayProducts(products);
}

/* =====================================================
   DEMO PRODUCTS
===================================================== */

function getDemoProducts() {
  return [
    {
      id: "demo1",
      name: "Traditional Clay Pottery",
      description:
        "Beautiful handmade pottery created by local artisans.",
      price: "799",
      location: "Hyderabad",
      category: "pottery",
      tags: ["Handmade", "Clay", "Traditional"],
      keywords: ["pottery", "clay", "handmade", "traditional"],
      image: "images/craft1.jpg",
      seller: "Local Potter",
      status: "Available"
    },
    {
      id: "demo2",
      name: "Bamboo Handwoven Basket",
      description:
        "Eco-friendly bamboo basket suitable for home decoration.",
      price: "499",
      location: "Vijayawada",
      category: "basket",
      tags: ["Bamboo", "Handwoven", "Eco-friendly"],
      keywords: ["basket", "bamboo", "handwoven"],
      image: "images/craft2.jpg",
      seller: "Village Crafts",
      status: "Available"
    },
    {
      id: "demo3",
      name: "Handloom Cotton Saree",
      description:
        "Comfortable traditional cotton saree made by skilled weavers.",
      price: "1499",
      location: "Visakhapatnam",
      category: "textile",
      tags: ["Handloom", "Cotton", "Traditional"],
      keywords: ["saree", "cotton", "handloom", "textile"],
      image: "images/craft3.jpg",
      seller: "Handloom Weaver",
      status: "Available"
    }
  ];
}

/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayProducts(products) {
  const productContainer =
    document.getElementById("productsContainer") ||
    document.getElementById("productResults") ||
    document.querySelector(".products-container");

  if (!productContainer) return;

  const allProducts = [
    ...getDemoProducts(),
    ...products
  ];

  if (allProducts.length === 0) {
    productContainer.innerHTML = `
      <p class="no-products">
        ${translations[selectedLanguage].noProducts}
      </p>
    `;
    return;
  }

  productContainer.innerHTML = allProducts
    .map(function (product) {
      return `
        <div class="product-card">
          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            class="product-image"
          />

          <div class="product-card-content">
            <span class="product-category">
              ${escapeHTML(product.category)}
            </span>

            <h3>${escapeHTML(product.name)}</h3>

            <p>${escapeHTML(product.description)}</p>

            <p class="product-price">
              ₹${escapeHTML(product.price)}
            </p>

            <p class="product-location">
              📍 ${escapeHTML(product.location)}
            </p>

            <div class="product-tags">
              ${(product.tags || [])
                .map(tag => `<span>${escapeHTML(tag)}</span>`)
                .join("")}
            </div>

            <button
              class="primary-button"
              onclick="requestToBuy('${product.id}')"
            >
              ${translations[selectedLanguage].requestBuy}
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

/* =====================================================
   SEARCH PRODUCTS
===================================================== */

function searchProducts() {
  const searchInput =
    getValue("buyerRequirement") ||
    getValue("searchInput") ||
    getValue("productSearch");

  const searchText = normalizeText(searchInput);

  const savedProducts = JSON.parse(
    localStorage.getItem("agriCraftProducts") || "[]"
  );

  const allProducts = [
    ...getDemoProducts(),
    ...savedProducts
  ];

  if (!searchText) {
    displayProducts(allProducts);
    return;
  }

  const matchedProducts = allProducts.filter(function (product) {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.location,
      ...(product.tags || []),
      ...(product.keywords || [])
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchText);
  });

  displayProducts(matchedProducts);
}

/* =====================================================
   AI MATCHING
===================================================== */

function calculateProductScore(product, requirement) {
  const searchText = normalizeText(requirement);

  if (!searchText) return 0;

  const words = searchText.split(" ");

  const searchableText = [
    product.name,
    product.description,
    product.category,
    product.location,
    ...(product.tags || []),
    ...(product.keywords || [])
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  words.forEach(function (word) {
    if (word.length > 2 && searchableText.includes(word)) {
      score += 1;
    }
  });

  if (normalizeText(product.name).includes(searchText)) {
    score += 5;
  }

  if (normalizeText(product.category).includes(searchText)) {
    score += 3;
  }

  return score;
}

function findAIMatches(requirement) {
  const savedProducts = JSON.parse(
    localStorage.getItem("agriCraftProducts") || "[]"
  );

  const allProducts = [
    ...getDemoProducts(),
    ...savedProducts
  ];

  const matches = allProducts
    .map(function (product) {
      return {
        ...product,
        score: calculateProductScore(product, requirement)
      };
    })
    .filter(product => product.score > 0)
    .sort((a, b) => b.score - a.score);

  currentMatch = matches.length > 0 ? matches[0] : null;

  displayProducts(matches);

  return matches;
}

/* =====================================================
   BUYER SEARCH BUTTON
===================================================== */

function handleBuyerSearch() {
  const requirement =
    getValue("buyerRequirement") ||
    getValue("searchInput") ||
    getValue("productSearch");

  if (!requirement) {
    alert("Please enter a product name or requirement.");
    return;
  }

  findAIMatches(requirement);
}

/* =====================================================
   REQUEST TO BUY
===================================================== */

function requestToBuy(productId) {
  const savedProducts = JSON.parse(
    localStorage.getItem("agriCraftProducts") || "[]"
  );

  const product = [
    ...getDemoProducts(),
    ...savedProducts
  ].find(item => String(item.id) === String(productId));

  if (!product) {
    alert("Product not found.");
    return;
  }

  const buyerName =
    getValue("buyerName") ||
    "Interested Buyer";

  const buyerContact =
    getValue("buyerContact") ||
    "Not provided";

  const orders = JSON.parse(
    localStorage.getItem("agriCraftOrders") || "[]"
  );

  const order = {
    id: Date.now(),
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    price: product.price,
    seller: product.seller,
    buyerName: buyerName,
    buyerContact: buyerContact,
    location: product.location,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  localStorage.setItem(
    "agriCraftOrders",
    JSON.stringify(orders)
  );

  alert("Your purchase request has been sent successfully!");

  showOrderRequests();
}

/* =====================================================
   ORDER REQUESTS
===================================================== */

function getOrders() {
  return JSON.parse(
    localStorage.getItem("agriCraftOrders") || "[]"
  );
}

function showOrderRequests() {
  const container =
    document.getElementById("orderRequests") ||
    document.getElementById("ordersContainer");

  if (!container) return;

  const orders = getOrders();

  if (orders.length === 0) {
    container.innerHTML = `
      <p class="no-orders">No order requests yet.</p>
    `;
    return;
  }

  container.innerHTML = orders
    .map(function (order) {
      return `
        <div class="order-card">
          <img
            src="${escapeHTML(order.productImage)}"
            alt="${escapeHTML(order.productName)}"
          />

          <div>
            <h3>${escapeHTML(order.productName)}</h3>
            <p>Buyer: ${escapeHTML(order.buyerName)}</p>
            <p>Contact: ${escapeHTML(order.buyerContact)}</p>
            <p>Price: ₹${escapeHTML(order.price)}</p>
            <p>Status: <strong>${escapeHTML(order.status)}</strong></p>
          </div>

          <button
            onclick="showVerifiedOrder('${order.id}')"
            class="secondary-button"
          >
            View Details
          </button>
        </div>
      `;
    })
    .join("");
}

function showVerifiedOrder(orderId) {
  const order = getOrders().find(
    item => String(item.id) === String(orderId)
  );

  if (!order) return;

  alert(
    `Product: ${order.productName}\n` +
    `Buyer: ${order.buyerName}\n` +
    `Contact: ${order.buyerContact}\n` +
    `Status: ${order.status}`
  );
}

/* =====================================================
   TRACK ORDER
===================================================== */

function trackOrder(orderId) {
  const order = getOrders().find(
    item => String(item.id) === String(orderId)
  );

  if (!order) {
    alert("Order not found.");
    return;
  }

  alert(`Order Status: ${order.status}`);
}

/* =====================================================
   CLEAR ORDERS
===================================================== */

function clearOrders() {
  const confirmClear = confirm(
    "Are you sure you want to clear all orders?"
  );

  if (!confirmClear) return;

  localStorage.removeItem("agriCraftOrders");
  showOrderRequests();
}

/* =====================================================
   MODAL FUNCTIONS
===================================================== */

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.style.display = "none";
  }
}

window.addEventListener("click", function (event) {
  document.querySelectorAll(".modal").forEach(function (modal) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.goToSeller = goToSeller;
window.goToBuyer = goToBuyer;

window.changeNavbarLanguage = changeNavbarLanguage;
window.changeSellerLanguage = changeSellerLanguage;
window.applyLanguage = applyLanguage;

window.startSellerVoice = startSellerVoice;
window.startBuyerVoice = startBuyerVoice;

window.generateCatalog = generateCatalog;
window.publishProduct = publishProduct;

window.searchProducts = searchProducts;
window.handleBuyerSearch = handleBuyerSearch;
window.findAIMatches = findAIMatches;

window.requestToBuy = requestToBuy;
window.showOrderRequests = showOrderRequests;
window.showVerifiedOrder = showVerifiedOrder;
window.trackOrder = trackOrder;
window.clearOrders = clearOrders;

window.openModal = openModal;
window.closeModal = closeModal;
