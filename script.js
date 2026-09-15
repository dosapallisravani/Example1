/* =====================================================
   AGRICRAFT CONNECT - FINAL UPDATED SCRIPT.JS
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
  scrollToSection("seller");
}

function goToBuyer() {
  scrollToSection("buyer");
}


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupImagePreview();
  setupUploadArea();
  initializePage();
  loadSavedProducts();
  showOrderRequests();
});


/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {
  const menuButton =
    document.getElementById("menuToggle") ||
    document.querySelector(".menu-toggle") ||
    document.querySelector(".hamburger");

  const navMenu =
    document.getElementById("navLinks") ||
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
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("imagePreview");
  const uploadPlaceholder =
    document.getElementById("uploadPlaceholder");

  if (!imageInput) return;

  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      if (imagePreview) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      }

      if (uploadPlaceholder) {
        uploadPlaceholder.style.display = "none";
      }
    };

    reader.readAsDataURL(file);
  });
}

function setupUploadArea() {
  const uploadArea = document.getElementById("uploadArea");
  const imageInput = document.getElementById("productImage");

  if (!uploadArea || !imageInput) return;

  uploadArea.addEventListener("click", function (event) {
    if (event.target !== imageInput) {
      imageInput.click();
    }
  });
}


/* =====================================================
   VOICE RECOGNITION
===================================================== */

function createVoiceRecognition(inputId, statusId, button, language) {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Voice recognition is not supported in this browser. Please use Google Chrome."
    );
    return;
  }

  const input = document.getElementById(inputId);
  const status = document.getElementById(statusId);

  if (!input) {
    console.error("Voice input not found:", inputId);
    alert("Voice input field not found.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = language || "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  if (button) {
    button.disabled = true;
    button.classList.add("recording");
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = "🔴 Listening...";
  }

  if (status) {
    status.textContent = "Listening... Please speak now.";
  }

  recognition.onstart = function () {
    console.log("Voice recognition started.");
  };

  recognition.onresult = function (event) {
    const transcript =
      event.results[0][0].transcript;

    input.value = transcript;

    input.dispatchEvent(
      new Event("input", { bubbles: true })
    );

    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    if (status) {
      status.textContent =
        "Voice captured successfully: " + transcript;
    }
  };

  recognition.onerror = function (event) {
    console.error(
      "Voice recognition error:",
      event.error
    );

    if (event.error === "not-allowed") {
      if (status) {
        status.textContent =
          "Microphone permission denied. Please allow microphone access.";
      }

      alert(
        "Microphone permission denied. Click the lock icon near the website address and allow microphone access."
      );
    } else if (event.error === "no-speech") {
      if (status) {
        status.textContent =
          "No voice detected. Please speak clearly and try again.";
      }

      alert("No voice detected. Please try again.");
    } else if (event.error === "audio-capture") {
      if (status) {
        status.textContent =
          "Microphone not found. Please check your microphone.";
      }

      alert("Microphone not found. Please check your microphone.");
    } else {
      if (status) {
        status.textContent =
          "Voice input failed. Please try again.";
      }

      alert(
        "Voice input failed. Please use Google Chrome and try again."
      );
    }
  };

  recognition.onend = function () {
    if (button) {
      button.disabled = false;
      button.classList.remove("recording");
      button.innerHTML =
        button.dataset.originalText ||
        "🎙️ Speak";
    }

    console.log("Voice recognition ended.");
  };

  try {
    recognition.start();
  } catch (error) {
    console.error("Unable to start recognition:", error);

    if (button) {
      button.disabled = false;
      button.classList.remove("recording");
    }

    if (status) {
      status.textContent =
        "Unable to start microphone. Please try again.";
    }
  }
}


/* =====================================================
   SELLER VOICE
===================================================== */

function startSellerVoice(button) {
  const languageSelect =
    document.getElementById("sellerLanguageSelect");

  const language =
    languageSelect
      ? languageSelect.value
      : "en-IN";

  createVoiceRecognition(
    "sellerProductName",
    "sellerVoiceStatus",
    button,
    language
  );
}


/* =====================================================
   BUYER VOICE
===================================================== */

function startBuyerVoice(button) {
  const languageSelect =
    document.getElementById("languageSelect");

  const language =
    languageSelect
      ? languageSelect.value
      : "en-IN";

  createVoiceRecognition(
    "buyerProduct",
    "buyerVoiceStatus",
    button,
    language
  );
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

    heroTitle: "From Local Craft to the Right Buyer",
    heroDescription:
      "AI-powered market linkage for rural producers. List with a photo and your voice — we do the rest.",

    sellerButton: "Sell Your Product",
    buyerButton: "Find Products",

    sellerTitle: "Sell Your Product",
    buyerTitle: "Find Products Easily",

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

    heroTitle: "స్థానిక కళాకృతులను సరైన కొనుగోలుదారుతో కలుపుదాం",
    heroDescription:
      "గ్రామీణ ఉత్పత్తిదారుల కోసం AI ఆధారిత మార్కెట్ అనుసంధానం. ఫోటో మరియు మీ వాయిస్‌తో ఉత్పత్తిని నమోదు చేయండి.",

    sellerButton: "మీ ఉత్పత్తిని అమ్మండి",
    buyerButton: "ఉత్పత్తులను వెతకండి",

    sellerTitle: "మీ ఉత్పత్తిని అమ్మండి",
    buyerTitle: "ఉత్పత్తులను సులభంగా కనుగొనండి",

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

    heroTitle: "स्थानीय उत्पादों को सही खरीदार से जोड़ना",
    heroDescription:
      "ग्रामीण उत्पादकों के लिए AI आधारित बाजार संपर्क। फोटो और आवाज से अपना उत्पाद सूचीबद्ध करें।",

    sellerButton: "अपना उत्पाद बेचें",
    buyerButton: "उत्पाद खोजें",

    sellerTitle: "अपना उत्पाद बेचें",
    buyerTitle: "उत्पाद आसानी से खोजें",

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

    heroTitle: "உள்ளூர் கைவினைப் பொருட்களை சரியான வாங்குபவருடன் இணைத்தல்",
    heroDescription:
      "கிராமப்புற உற்பத்தியாளர்களுக்கான AI அடிப்படையிலான சந்தை இணைப்பு.",

    sellerButton: "உங்கள் பொருளை விற்கவும்",
    buyerButton: "பொருட்களை தேடுங்கள்",

    sellerTitle: "உங்கள் பொருளை விற்கவும்",
    buyerTitle: "பொருட்களை எளிதாக கண்டறியுங்கள்",

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

    heroTitle: "ಸ್ಥಳೀಯ ಉತ್ಪನ್ನಗಳನ್ನು ಸರಿಯಾದ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು",
    heroDescription:
      "ಗ್ರಾಮೀಣ ಉತ್ಪಾದಕರಿಗಾಗಿ AI ಆಧಾರಿತ ಮಾರುಕಟ್ಟೆ ಸಂಪರ್ಕ.",

    sellerButton: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟ ಮಾಡಿ",
    buyerButton: "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ",

    sellerTitle: "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟ ಮಾಡಿ",
    buyerTitle: "ಉತ್ಪನ್ನಗಳನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಿ",

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

    heroTitle: "പ്രാദേശിക ഉൽപ്പന്നങ്ങളെ ശരിയായ വാങ്ങുന്നവരുമായി ബന്ധിപ്പിക്കുന്നു",
    heroDescription:
      "ഗ്രാമീണ ഉൽപ്പാദകർക്കായുള്ള AI അടിസ്ഥാനമാക്കിയുള്ള വിപണി ബന്ധം.",

    sellerButton: "നിങ്ങളുടെ ഉൽപ്പന്നം വിൽക്കുക",
    buyerButton: "ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തുക",

    sellerTitle: "നിങ്ങളുടെ ഉൽപ്പന്നം വിൽക്കുക",
    buyerTitle: "ഉൽപ്പന്നങ്ങൾ എളുപ്പത്തിൽ കണ്ടെത്തുക",

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
   LANGUAGE HELPERS
===================================================== */

function convertLanguageCode(language) {
  if (!language) return "en";

  return language.split("-")[0];
}


/* =====================================================
   HERO LANGUAGE CHANGE
===================================================== */

function changeHeroLanguage(language) {
  selectedLanguage = convertLanguageCode(language);

  const data =
    translations[selectedLanguage] ||
    translations.en;

  const heroTitle = document.getElementById("heroTitle");
  const heroDescription =
    document.getElementById("heroDescription");

  const sellerButton =
    document.getElementById("sellerHeroButton");

  const buyerButton =
    document.getElementById("buyerHeroButton");

  if (heroTitle) {
    heroTitle.innerHTML =
      data.heroTitle.includes("Right Buyer")
        ? 'From Local Craft<br>to the <span>Right Buyer</span>'
        : data.heroTitle;
  }

  if (heroDescription) {
    heroDescription.textContent =
      data.heroDescription;
  }

  if (sellerButton) {
    sellerButton.textContent =
      data.sellerButton;
  }

  if (buyerButton) {
    buyerButton.textContent =
      data.buyerButton;
  }

  applyLanguage(selectedLanguage);

  localStorage.setItem(
    "agriCraftLanguage",
    selectedLanguage
  );
}


/* =====================================================
   NAVBAR LANGUAGE CHANGE
===================================================== */

function changeNavbarLanguage(language) {
  selectedLanguage = convertLanguageCode(language);

  applyLanguage(selectedLanguage);
  changeHeroLanguage(language);

  const heroSelect =
    document.getElementById("heroLanguageSelect");

  if (heroSelect) {
    heroSelect.value = language;
  }

  const sellerSelect =
    document.getElementById("sellerLanguageSelect");

  if (sellerSelect) {
    sellerSelect.value = language;
  }

  const buyerSelect =
    document.getElementById("languageSelect");

  if (buyerSelect) {
    buyerSelect.value = language;
  }
}


/* =====================================================
   SELLER LANGUAGE CHANGE
===================================================== */

function changeSellerLanguage(language) {
  sellerLanguage = convertLanguageCode(language);

  const heroSelect =
    document.getElementById("heroLanguageSelect");

  if (heroSelect) {
    heroSelect.value = language;
  }

  applyLanguage(sellerLanguage);
}


/* =====================================================
   BUYER LANGUAGE CHANGE
===================================================== */

function changeLanguage(language) {
  selectedLanguage = convertLanguageCode(language);

  applyLanguage(selectedLanguage);
}


/* =====================================================
   APPLY LANGUAGE
===================================================== */

function applyLanguage(language) {
  const data =
    translations[language] ||
    translations.en;

  document.querySelectorAll("[data-translate]").forEach(function (element) {
    const key = element.getAttribute("data-translate");

    if (data[key]) {
      element.textContent = data[key];
    }
  });

  setText("sellerTitle", data.sellerTitle);
  setText("buyerTitle", data.buyerTitle);

  const searchInput =
    document.getElementById("buyerProduct") ||
    document.getElementById("searchInput");

  if (searchInput) {
    searchInput.placeholder =
      data.searchPlaceholder;
  }
}


/* =====================================================
   INITIALIZE LANGUAGE
===================================================== */

function initializePage() {
  const savedLanguage =
    localStorage.getItem("agriCraftLanguage") ||
    "en";

  selectedLanguage = savedLanguage;

  const languageValue =
    savedLanguage + "-IN";

  const navbarSelect =
    document.getElementById("navbarLanguageSelect");

  const heroSelect =
    document.getElementById("heroLanguageSelect");

  const sellerSelect =
    document.getElementById("sellerLanguageSelect");

  const buyerSelect =
    document.getElementById("languageSelect");

  if (navbarSelect) {
    navbarSelect.value = languageValue;
  }

  if (heroSelect) {
    heroSelect.value = languageValue;
  }

  if (sellerSelect) {
    sellerSelect.value = languageValue;
  }

  if (buyerSelect) {
    buyerSelect.value = languageValue;
  }

  changeHeroLanguage(languageValue);
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
    "కుండ",
    "మట్టి",
    "मिट्टी",
    "बर्तन",
    "களிமண்",
    "ಮಣ್ಣಿನ",
    "മൺപാത്രം"
  ];

  const basketWords = [
    "basket",
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

  if (potteryWords.some(word =>
    text.includes(normalizeText(word))
  )) {
    return "pottery";
  }

  if (basketWords.some(word =>
    text.includes(normalizeText(word))
  )) {
    return "basket";
  }

  if (textileWords.some(word =>
    text.includes(normalizeText(word))
  )) {
    return "textile";
  }

  if (jewelryWords.some(word =>
    text.includes(normalizeText(word))
  )) {
    return "jewelry";
  }

  if (foodWords.some(word =>
    text.includes(normalizeText(word))
  )) {
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

  return imageMap[category] ||
    "images/craft6.jpg";
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

  const baseTags =
    categoryTags[category] ||
    categoryTags.craft;

  const words = normalizeText(
    productName + " " + description
  ).split(" ");

  const extraTags = [];

  words.forEach(function (word) {
    if (
      word.length > 3 &&
      !baseTags
        .map(tag => normalizeText(tag))
        .includes(word)
    ) {
      extraTags.push(
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    }
  });

  return [
    ...new Set([
      ...baseTags,
      ...extraTags
    ])
  ].slice(0, 6);
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
    ...generateTags(name, description)
      .map(tag => normalizeText(tag))
  ];

  return [
    ...new Set(
      keywords.filter(Boolean)
    )
  ];
}


/* =====================================================
   AI CATALOG GENERATION
===================================================== */

function generateCatalog() {
  const name =
    getValue("sellerProductName");

  const quantity =
    getValue("sellerQuantity");

  const price =
    getValue("sellerPrice");

  const location =
    getValue("sellerLocation") ||
    "India";

  if (!name) {
    alert("Please enter a product name.");
    return;
  }

  const category = detectCategory(name);
  const tags = generateTags(name);
  const keywords = createProductKeywords(name);

  const imageInput =
    document.getElementById("productImage");

  const file =
    imageInput && imageInput.files
      ? imageInput.files[0]
      : null;

  function createCatalog(imageSource) {
    currentCatalog = {
      id: Date.now(),
      name: name,
      description:
        "Handcrafted quality product created by a rural producer.",
      quantity: quantity || "Available",
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
  const catalogResult =
    document.getElementById("catalogResult");

  const catalogEmpty =
    document.getElementById("catalogEmpty");

  const catalogImage =
    document.getElementById("catalogImage");

  const catalogName =
    document.getElementById("catalogName");

  const catalogDescription =
    document.getElementById("catalogDescription");

  const catalogCategory =
    document.getElementById("catalogCategory");

  const catalogTags =
    document.getElementById("catalogTags");

  const catalogQuantity =
    document.getElementById("catalogQuantity");

  const catalogPrice =
    document.getElementById("catalogPrice");

  const catalogLocation =
    document.getElementById("catalogLocation");

  const aiProcessing =
    document.getElementById("aiProcessing");

  if (aiProcessing) {
    aiProcessing.style.display = "none";
  }

  if (catalogEmpty) {
    catalogEmpty.style.display = "none";
  }

  if (catalogResult) {
    catalogResult.style.display = "block";
  }

  if (catalogImage) {
    catalogImage.src = product.image;
    catalogImage.alt = product.name;
  }

  if (catalogName) {
    catalogName.textContent = product.name;
  }

  if (catalogDescription) {
    catalogDescription.textContent =
      product.description;
  }

  if (catalogCategory) {
    catalogCategory.textContent =
      "Category: " + product.category;
  }

  if (catalogTags) {
    catalogTags.textContent =
      "Tags: " + product.tags.join(", ");
  }

  if (catalogQuantity) {
    catalogQuantity.textContent =
      "Quantity: " + product.quantity;
  }

  if (catalogPrice) {
    catalogPrice.textContent =
      "Price: ₹" + product.price;
  }

  if (catalogLocation) {
    catalogLocation.textContent =
      "Location: " + product.location;
  }
}


/* =====================================================
   PUBLISH PRODUCT
===================================================== */

function publishProduct() {
  if (!currentCatalog) {
    alert("Please generate the catalog first.");
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

  const catalogResult =
    document.getElementById("catalogResult");

  const catalogEmpty =
    document.getElementById("catalogEmpty");

  if (catalogResult) {
    catalogResult.style.display = "none";
  }

  if (catalogEmpty) {
    catalogEmpty.style.display = "block";
  }

  clearSellerForm();
  loadSavedProducts();
}


/* =====================================================
   CLEAR SELLER FORM
===================================================== */

function clearSellerForm() {
  [
    "sellerProductName",
    "sellerQuantity",
    "sellerPrice",
    "sellerLocation"
  ].forEach(function (id) {
    setValue(id, "");
  });

  const imageInput =
    document.getElementById("productImage");

  if (imageInput) {
    imageInput.value = "";
  }

  const imagePreview =
    document.getElementById("imagePreview");

  const uploadPlaceholder =
    document.getElementById("uploadPlaceholder");

  if (imagePreview) {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }

  if (uploadPlaceholder) {
    uploadPlaceholder.style.display = "block";
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
    },
    {
      id: "demo4",
      name: "Handcrafted Tribal Jewellery",
      description:
        "Unique traditional jewellery made by rural artisans.",
      price: "999",
      location: "Warangal",
      category: "jewelry",
      tags: ["Handcrafted", "Traditional", "Unique"],
      keywords: ["jewellery", "jewelry", "necklace", "handcrafted"],
      image: "images/craft4.jpg",
      seller: "Tribal Artisan",
      status: "Available"
    },
    {
      id: "demo5",
      name: "Organic Homemade Pickle",
      description:
        "Fresh homemade pickle prepared using traditional methods.",
      price: "299",
      location: "Eluru",
      category: "food",
      tags: ["Organic", "Homemade", "Natural"],
      keywords: ["pickle", "organic", "homemade", "food"],
      image: "images/craft5.jpg",
      seller: "Village Foods",
      status: "Available"
    },
    {
      id: "demo6",
      name: "Handmade Wooden Craft",
      description:
        "Beautiful decorative wooden craft made by skilled artisans.",
      price: "699",
      location: "Rajahmundry",
      category: "craft",
      tags: ["Handmade", "Wooden", "Traditional"],
      keywords: ["wood", "craft", "handmade", "decorative"],
      image: "images/craft6.jpg",
      seller: "Wood Craft Artist",
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
    ...products.filter(product =>
      !String(product.id).startsWith("demo")
    )
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

            <h3>
              ${escapeHTML(product.name)}
            </h3>

            <p>
              ${escapeHTML(product.description)}
            </p>

            <p class="product-price">
              ₹${escapeHTML(product.price)}
            </p>

            <p class="product-location">
              📍 ${escapeHTML(product.location)}
            </p>

            <div class="product-tags">
              ${(product.tags || [])
                .map(tag =>
                  `<span>${escapeHTML(tag)}</span>`
                )
                .join("")}
            </div>

            <button
              class="primary-button"
              type="button"
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
  const searchText = normalizeText(
    getValue("buyerProduct") ||
    getValue("searchInput") ||
    getValue("productSearch")
  );

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
    if (
      word.length > 2 &&
      searchableText.includes(word)
    ) {
      score += 1;
    }
  });

  if (
    normalizeText(product.name)
      .includes(searchText)
  ) {
    score += 5;
  }

  if (
    normalizeText(product.category)
      .includes(searchText)
  ) {
    score += 3;
  }

  return score;
}

function findAIMatches(requirement) {
  const buyerRequirement =
    requirement ||
    getValue("buyerProduct");

  if (!buyerRequirement) {
    alert("Please enter a product requirement.");
    return [];
  }

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
        score: calculateProductScore(
          product,
          buyerRequirement
        )
      };
    })
    .filter(product => product.score > 0)
    .sort((a, b) => b.score - a.score);

  currentMatch =
    matches.length > 0
      ? matches[0]
      : null;

  displayProducts(matches);

  if (matches.length === 0) {
    alert("No suitable products found.");
  }

  return matches;
}


/* =====================================================
   BUYER SEARCH
===================================================== */

function handleBuyerSearch() {
  const requirement =
    getValue("buyerProduct");

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
  ].find(function (item) {
    return String(item.id) === String(productId);
  });

  if (!product) {
    alert("Product not found.");
    return;
  }

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
    buyerName: "Interested Buyer",
    buyerContact: "Not provided",
    location: product.location,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  localStorage.setItem(
    "agriCraftOrders",
    JSON.stringify(orders)
  );

  alert(
    "Your purchase request has been sent successfully!"
  );

  showOrderRequests();
}


/* =====================================================
   ORDER FUNCTIONS
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
      <p class="no-orders">
        No order requests yet.
      </p>
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
            <h3>
              ${escapeHTML(order.productName)}
            </h3>

            <p>
              Buyer: ${escapeHTML(order.buyerName)}
            </p>

            <p>
              Contact: ${escapeHTML(order.buyerContact)}
            </p>

            <p>
              Price: ₹${escapeHTML(order.price)}
            </p>

            <p>
              Status:
              <strong>
                ${escapeHTML(order.status)}
              </strong>
            </p>
          </div>

          <button
            type="button"
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
  const order = getOrders().find(function (item) {
    return String(item.id) === String(orderId);
  });

  if (!order) {
    alert("Order not found.");
    return;
  }

  alert(
    "Product: " + order.productName + "\n" +
    "Buyer: " + order.buyerName + "\n" +
    "Contact: " + order.buyerContact + "\n" +
    "Status: " + order.status
  );
}

function trackOrder(orderId) {
  const order = getOrders().find(function (item) {
    return String(item.id) === String(orderId);
  });

  if (!order) {
    alert("Order not found.");
    return;
  }

  alert("Order Status: " + order.status);
}

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

function openModal(modalId = "modalOverlay") {
  const modal =
    document.getElementById(modalId);

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeModal(modalId = "modalOverlay") {
  const modal =
    document.getElementById(modalId);

  if (modal) {
    modal.style.display = "none";
  }
}

window.addEventListener("click", function (event) {
  const modal =
    document.getElementById("modalOverlay");

  if (event.target === modal) {
    modal.style.display = "none";
  }
});


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.goToSeller = goToSeller;
window.goToBuyer = goToBuyer;

window.changeHeroLanguage = changeHeroLanguage;
window.changeNavbarLanguage = changeNavbarLanguage;
window.changeSellerLanguage = changeSellerLanguage;
window.changeLanguage = changeLanguage;
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
