/* =====================================================
   AGRICRAFT CONNECT
   COMPLETE FRONTEND SCRIPT
   Voice + Languages + Catalog + Matching + Orders
   + Verification + Receipt + LocalStorage
===================================================== */


/* =====================================================
   GLOBAL SETTINGS
===================================================== */

let selectedLanguage = localStorage.getItem("agriCraftLanguage") || "en-IN";

const LANGUAGE_NAMES = {
  "en-IN": "English",
  "te-IN": "తెలుగు",
  "hi-IN": "हिंदी",
  "ta-IN": "தமிழ்",
  "kn-IN": "ಕನ್ನಡ",
  "ml-IN": "മലയാളം"
};


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

function setupMobileNavigation() {

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });

  });
}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function scrollToSection(id) {

  const section = document.getElementById(id);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


function goToSeller() {
  scrollToSection("seller");
}


function goToBuyer() {
  scrollToSection("buyer");
}


function goToOrders() {

  scrollToSection("orders");

  setTimeout(function () {
    showOrderRequests();
  }, 500);
}


/* =====================================================
   VOICE RECOGNITION
===================================================== */

function getSpeechRecognition() {

  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );

}


function createVoiceRecognition() {

  const SpeechRecognition = getSpeechRecognition();

  if (!SpeechRecognition) {

    alert(
      "Voice recognition is not supported in this browser.\n\n" +
      "Please open the website in Google Chrome."
    );

    return null;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = selectedLanguage;

  recognition.continuous = false;

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  return recognition;
}


/* =====================================================
   VOICE STATUS
===================================================== */

function setVoiceStatus(elementId, message) {

  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = message;
  }

}


/* =====================================================
   SELLER VOICE
===================================================== */

function startSellerVoice(buttonElement) {

  const productInput =
    document.getElementById("sellerProductName");

  if (!productInput) return;

  const recognition = createVoiceRecognition();

  if (!recognition) return;

  if (buttonElement) {

    buttonElement.disabled = true;

    buttonElement.textContent = "🎤 Listening...";

  }

  setVoiceStatus(
    "sellerVoiceStatus",
    "🎤 Listening... Please speak now"
  );

  recognition.onstart = function () {

    console.log(
      "Seller voice started:",
      selectedLanguage
    );

  };


  recognition.onresult = function (event) {

    if (
      !event.results ||
      !event.results[0] ||
      !event.results[0][0]
    ) {
      return;
    }

    const transcript =
      event.results[0][0].transcript.trim();

    console.log(
      "Seller voice:",
      transcript
    );

    productInput.value = transcript;

    productInput.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    setVoiceStatus(
      "sellerVoiceStatus",
      "✅ Voice detected: " + transcript
    );

  };


  recognition.onerror = function (event) {

    console.error(
      "Seller voice error:",
      event.error
    );

    handleVoiceError(
      event.error,
      "sellerVoiceStatus"
    );

  };


  recognition.onend = function () {

    if (buttonElement) {

      buttonElement.disabled = false;

      buttonElement.textContent =
        "🎤 Speak Product Name";

    }

    console.log(
      "Seller voice recognition ended"
    );

  };


  try {

    recognition.start();

  } catch (error) {

    console.error(
      "Seller recognition start error:",
      error
    );

  }

}


/* =====================================================
   BUYER VOICE
===================================================== */

function startBuyerVoice(buttonElement) {

  const productInput =
    document.getElementById("buyerProduct");

  if (!productInput) return;

  const recognition = createVoiceRecognition();

  if (!recognition) return;

  if (buttonElement) {

    buttonElement.disabled = true;

    buttonElement.textContent = "🎤 Listening...";

  }

  setVoiceStatus(
    "buyerVoiceStatus",
    "🎤 Listening... Please speak now"
  );


  recognition.onstart = function () {

    console.log(
      "Buyer voice started:",
      selectedLanguage
    );

  };


  recognition.onresult = function (event) {

    if (
      !event.results ||
      !event.results[0] ||
      !event.results[0][0]
    ) {
      return;
    }

    const transcript =
      event.results[0][0].transcript.trim();

    console.log(
      "Buyer voice:",
      transcript
    );

    productInput.value = transcript;

    productInput.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );

    setVoiceStatus(
      "buyerVoiceStatus",
      "✅ Voice detected: " + transcript
    );

  };


  recognition.onerror = function (event) {

    console.error(
      "Buyer voice error:",
      event.error
    );

    handleVoiceError(
      event.error,
      "buyerVoiceStatus"
    );

  };


  recognition.onend = function () {

    if (buttonElement) {

      buttonElement.disabled = false;

      buttonElement.textContent =
        "🎤 Speak Product Name";

    }

  };


  try {

    recognition.start();

  } catch (error) {

    console.error(
      "Buyer recognition start error:",
      error
    );

  }

}


/* =====================================================
   VOICE ERROR HANDLER
===================================================== */

function handleVoiceError(error, statusId) {

  let message = "Voice recognition failed.";

  switch (error) {

    case "not-allowed":
      message =
        "❌ Microphone permission denied. Please allow microphone access.";
      break;

    case "no-speech":
      message =
        "⚠️ No speech detected. Please speak clearly.";
      break;

    case "audio-capture":
      message =
        "❌ Microphone not found. Check your microphone.";
      break;

    case "network":
      message =
        "❌ Network error. Voice recognition may require an internet connection.";
      break;

    case "language-not-supported":
      message =
        "❌ Selected language is not supported by this browser.";
      break;

    default:
      message =
        "❌ Voice error: " + error;
  }

  setVoiceStatus(statusId, message);

}


/* =====================================================
   LANGUAGE CHANGE
===================================================== */

function changeLanguage() {

  const selector =
    document.getElementById("languageSelect");

  if (!selector) return;

  selectedLanguage = selector.value;

  localStorage.setItem(
    "agriCraftLanguage",
    selectedLanguage
  );

  applyTranslations();

  setVoiceStatus(
    "sellerVoiceStatus",
    "Language: " +
      LANGUAGE_NAMES[selectedLanguage]
  );

  setVoiceStatus(
    "buyerVoiceStatus",
    "Language: " +
      LANGUAGE_NAMES[selectedLanguage]
  );

}


/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {

  "en-IN": {

    logo: "AgriCraft Connect",

    heroBadge: "AI-Powered Rural Marketplace",

    heroTitle:
      "Connecting Rural Producers with the Right Buyers",

    heroText:
      "Sell your handmade products, discover buyers and grow your rural business with AI-powered market linkage.",

    sellerButton: "I'm a Seller",

    buyerButton: "I'm a Buyer",

    sellerTitle:
      "Sell Your Product",

    sellerSubtitle:
      "Upload your product and create a smart catalog.",

    buyerTitle:
      "Find Products",

    buyerSubtitle:
      "Tell us what you need and let AI find the right match.",

    ordersTitle:
      "My Orders",

    ordersSubtitle:
      "Track requests, verification and receipts.",

    generateCatalog:
      "✨ Generate AI Catalog",

    publishProduct:
      "Publish Product",

    findMatches:
      "🔎 Find AI Matches",

    requestBuy:
      "Request to Buy",

    verifyOrder:
      "Verify Order",

    negotiate:
      "Negotiate",

    accept:
      "Accept",

    selectLanguage:
      "🌐 Select Your Language"

  },


  "te-IN": {

    logo: "అగ్రిక్రాఫ్ట్ కనెక్ట్",

    heroBadge:
      "AI ఆధారిత గ్రామీణ మార్కెట్",

    heroTitle:
      "గ్రామీణ ఉత్పత్తిదారులను సరైన కొనుగోలుదారులతో కలుపుతుంది",

    heroText:
      "మీ చేతితో తయారు చేసిన ఉత్పత్తులను అమ్మండి, కొనుగోలుదారులను కనుగొనండి మరియు AI సహాయంతో మీ వ్యాపారాన్ని పెంచుకోండి.",

    sellerButton:
      "నేను విక్రేతను",

    buyerButton:
      "నేను కొనుగోలుదారుని",

    sellerTitle:
      "మీ ఉత్పత్తిని అమ్మండి",

    sellerSubtitle:
      "మీ ఉత్పత్తిని అప్‌లోడ్ చేసి స్మార్ట్ క్యాటలాగ్ రూపొందించండి.",

    buyerTitle:
      "ఉత్పత్తులను కనుగొనండి",

    buyerSubtitle:
      "మీకు కావాల్సిన ఉత్పత్తిని చెప్పండి. AI సరైన ఉత్పత్తిని కనుగొంటుంది.",

    ordersTitle:
      "నా ఆర్డర్లు",

    ordersSubtitle:
      "రిక్వెస్ట్‌లు, వెరిఫికేషన్ మరియు రసీదులను చూడండి.",

    generateCatalog:
      "✨ AI క్యాటలాగ్ రూపొందించండి",

    publishProduct:
      "ఉత్పత్తిని ప్రచురించండి",

    findMatches:
      "🔎 AI మ్యాచ్‌లను కనుగొనండి",

    requestBuy:
      "కొనుగోలు అభ్యర్థన",

    verifyOrder:
      "ఆర్డర్ వెరిఫై చేయండి",

    negotiate:
      "ధర చర్చించండి",

    accept:
      "అంగీకరించండి",

    selectLanguage:
      "🌐 మీ భాషను ఎంచుకోండి"

  },


  "hi-IN": {

    logo:
      "एग्रीक्राफ्ट कनेक्ट",

    heroBadge:
      "AI आधारित ग्रामीण बाजार",

    heroTitle:
      "ग्रामीण उत्पादकों को सही खरीदारों से जोड़ना",

    heroText:
      "अपने हस्तनिर्मित उत्पाद बेचें, खरीदार खोजें और AI की मदद से अपना ग्रामीण व्यवसाय बढ़ाएं।",

    sellerButton:
      "मैं विक्रेता हूँ",

    buyerButton:
      "मैं खरीदार हूँ",

    sellerTitle:
      "अपना उत्पाद बेचें",

    sellerSubtitle:
      "अपना उत्पाद अपलोड करें और स्मार्ट कैटलॉग बनाएं।",

    buyerTitle:
      "उत्पाद खोजें",

    buyerSubtitle:
      "अपनी जरूरत बताएं और AI सही उत्पाद खोजेगा।",

    ordersTitle:
      "मेरे ऑर्डर",

    ordersSubtitle:
      "रिक्वेस्ट, सत्यापन और रसीद देखें।",

    generateCatalog:
      "✨ AI कैटलॉग बनाएं",

    publishProduct:
      "उत्पाद प्रकाशित करें",

    findMatches:
      "🔎 AI मैच खोजें",

    requestBuy:
      "खरीद अनुरोध",

    verifyOrder:
      "ऑर्डर सत्यापित करें",

    negotiate:
      "बातचीत करें",

    accept:
      "स्वीकार करें",

    selectLanguage:
      "🌐 अपनी भाषा चुनें"

  },


  "ta-IN": {

    logo:
      "அக்ரிகிராஃப்ட் கனெக்ட்",

    heroBadge:
      "AI அடிப்படையிலான கிராமப்புற சந்தை",

    heroTitle:
      "கிராமப்புற உற்பத்தியாளர்களை சரியான வாங்குபவர்களுடன் இணைக்கிறது",

    heroText:
      "உங்கள் கைவினைப் பொருட்களை விற்று, வாங்குபவர்களைக் கண்டறிந்து, AI உதவியுடன் உங்கள் வணிகத்தை வளர்த்துக் கொள்ளுங்கள்.",

    sellerButton:
      "நான் விற்பனையாளர்",

    buyerButton:
      "நான் வாங்குபவர்",

    sellerTitle:
      "உங்கள் பொருளை விற்கவும்",

    sellerSubtitle:
      "உங்கள் பொருளைப் பதிவேற்றி ஸ்மார்ட் பட்டியலை உருவாக்கவும்.",

    buyerTitle:
      "பொருட்களைத் தேடுங்கள்",

    buyerSubtitle:
      "உங்களுக்கு தேவையான பொருளைச் சொல்லுங்கள். AI சரியான பொருளைக் கண்டறியும்.",

    ordersTitle:
      "எனது ஆர்டர்கள்",

    ordersSubtitle:
      "கோரிக்கைகள், சரிபார்ப்பு மற்றும் ரசீதுகளைப் பார்க்கவும்.",

    generateCatalog:
      "✨ AI பட்டியல் உருவாக்கவும்",

    publishProduct:
      "பொருளை வெளியிடவும்",

    findMatches:
      "🔎 AI பொருத்தங்களைக் கண்டறியவும்",

    requestBuy:
      "வாங்கும் கோரிக்கை",

    verifyOrder:
      "ஆர்டரை சரிபார்க்கவும்",

    negotiate:
      "பேச்சுவார்த்தை",

    accept:
      "ஏற்கவும்",

    selectLanguage:
      "🌐 உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்"

  },


  "kn-IN": {

    logo:
      "ಅಗ್ರಿಕ್ರಾಫ್ಟ್ ಕನೆಕ್ಟ್",

    heroBadge:
      "AI ಆಧಾರಿತ ಗ್ರಾಮೀಣ ಮಾರುಕಟ್ಟೆ",

    heroTitle:
      "ಗ್ರಾಮೀಣ ಉತ್ಪಾದಕರನ್ನು ಸರಿಯಾದ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು",

    heroText:
      "ನಿಮ್ಮ ಕೈಯಿಂದ ತಯಾರಿಸಿದ ಉತ್ಪನ್ನಗಳನ್ನು ಮಾರಾಟ ಮಾಡಿ ಮತ್ತು AI ಸಹಾಯದಿಂದ ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಿ.",

    sellerButton:
      "ನಾನು ಮಾರಾಟಗಾರ",

    buyerButton:
      "ನಾನು ಖರೀದಿದಾರ",

    sellerTitle:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಮಾರಾಟ ಮಾಡಿ",

    sellerSubtitle:
      "ನಿಮ್ಮ ಉತ್ಪನ್ನವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಟಲಾಗ್ ರಚಿಸಿ.",

    buyerTitle:
      "ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ",

    buyerSubtitle:
      "ನಿಮಗೆ ಬೇಕಾದುದನ್ನು ತಿಳಿಸಿ ಮತ್ತು AI ಸರಿಯಾದ ಉತ್ಪನ್ನವನ್ನು ಹುಡುಕುತ್ತದೆ.",

    ordersTitle:
      "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",

    ordersSubtitle:
      "ವಿನಂತಿಗಳು, ಪರಿಶೀಲನೆ ಮತ್ತು ರಸೀದಿಗಳನ್ನು ನೋಡಿ.",

    generateCatalog:
      "✨ AI ಕ್ಯಾಟಲಾಗ್ ರಚಿಸಿ",

    publishProduct:
      "ಉತ್ಪನ್ನ ಪ್ರಕಟಿಸಿ",

    findMatches:
      "🔎 AI ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕಿ",

    requestBuy:
      "ಖರೀದಿ ವಿನಂತಿ",

    verifyOrder:
      "ಆರ್ಡರ್ ಪರಿಶೀಲಿಸಿ",

    negotiate:
      "ಬೆಲೆ ಮಾತುಕತೆ",

    accept:
      "ಸ್ವೀಕರಿಸಿ",

    selectLanguage:
      "🌐 ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"

  },


  "ml-IN": {

    logo:
      "അഗ്രിക്രാഫ്റ്റ് കണക്ട്",

    heroBadge:
      "AI അടിസ്ഥാനമാക്കിയ ഗ്രാമീണ വിപണി",

    heroTitle:
      "ഗ്രാമീണ ഉത്പാദകരെ ശരിയായ വാങ്ങുന്നവരുമായി ബന്ധിപ്പിക്കുന്നു",

    heroText:
      "നിങ്ങളുടെ കൈത്തറി ഉത്പന്നങ്ങൾ വിൽക്കുകയും AI സഹായത്തോടെ നിങ്ങളുടെ ബിസിനസ്സ് വളർത്തുകയും ചെയ്യുക.",

    sellerButton:
      "ഞാൻ വിൽപ്പനക്കാരൻ",

    buyerButton:
      "ഞാൻ വാങ്ങുന്നയാൾ",

    sellerTitle:
      "നിങ്ങളുടെ ഉത്പന്നം വിൽക്കുക",

    sellerSubtitle:
      "ഉത്പന്നം അപ്‌ലോഡ് ചെയ്ത് സ്മാർട്ട് കാറ്റലോഗ് സൃഷ്ടിക്കുക.",

    buyerTitle:
      "ഉത്പന്നങ്ങൾ കണ്ടെത്തുക",

    buyerSubtitle:
      "നിങ്ങൾക്ക് ആവശ്യമുള്ളത് പറയൂ. AI ശരിയായ ഉത്പന്നം കണ്ടെത്തും.",

    ordersTitle:
      "എന്റെ ഓർഡറുകൾ",

    ordersSubtitle:
      "അഭ്യർത്ഥനകളും പരിശോധനയും രസീതുകളും കാണുക.",

    generateCatalog:
      "✨ AI കാറ്റലോഗ് സൃഷ്ടിക്കുക",

    publishProduct:
      "ഉത്പന്നം പ്രസിദ്ധീകരിക്കുക",

    findMatches:
      "🔎 AI പൊരുത്തങ്ങൾ കണ്ടെത്തുക",

    requestBuy:
      "വാങ്ങൽ അഭ്യർത്ഥന",

    verifyOrder:
      "ഓർഡർ പരിശോധിക്കുക",

    negotiate:
      "വില ചർച്ച ചെയ്യുക",

    accept:
      "അംഗീകരിക്കുക",

    selectLanguage:
      "🌐 നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക"

  }

};


/* =====================================================
   APPLY WEBSITE TRANSLATIONS
===================================================== */

function applyTranslations() {

  const t =
    translations[selectedLanguage] ||
    translations["en-IN"];

  const logoText =
    document.querySelector(".logo-text");

  if (logoText) {
    logoText.textContent = t.logo;
  }


  const heroBadge =
    document.querySelector(".hero-badge");

  if (heroBadge) {
    heroBadge.textContent = t.heroBadge;
  }


  const heroHeading =
    document.querySelector(".hero-content h1");

  if (heroHeading) {
    heroHeading.textContent = t.heroTitle;
  }


  const heroParagraph =
    document.querySelector(".hero-content p");

  if (heroParagraph) {
    heroParagraph.textContent = t.heroText;
  }


  const heroButtons =
    document.querySelectorAll(".hero-buttons button");

  if (heroButtons[0]) {
    heroButtons[0].textContent =
      t.sellerButton;
  }

  if (heroButtons[1]) {
    heroButtons[1].textContent =
      t.buyerButton;
  }


  const sellerHeading =
    document.querySelector("#seller .section-heading");

  if (sellerHeading) {

    const heading =
      sellerHeading.querySelector("h2");

    const paragraph =
      sellerHeading.querySelector("p");

    if (heading) {
      heading.textContent = t.sellerTitle;
    }

    if (paragraph) {
      paragraph.textContent =
        t.sellerSubtitle;
    }

  }


  const buyerHeading =
    document.querySelector("#buyer .section-heading");

  if (buyerHeading) {

    const heading =
      buyerHeading.querySelector("h2");

    const paragraph =
      buyerHeading.querySelector("p");

    if (heading) {
      heading.textContent = t.buyerTitle;
    }

    if (paragraph) {
      paragraph.textContent =
        t.buyerSubtitle;
    }

  }


  const ordersHeading =
    document.querySelector("#orders .section-heading");

  if (ordersHeading) {

    const heading =
      ordersHeading.querySelector("h2");

    const paragraph =
      ordersHeading.querySelector("p");

    if (heading) {
      heading.textContent =
        t.ordersTitle;
    }

    if (paragraph) {
      paragraph.textContent =
        t.ordersSubtitle;
    }

  }


  const languageLabel =
    document.querySelector(
      ".language-selector .field-label"
    );

  if (languageLabel) {
    languageLabel.textContent =
      t.selectLanguage;
  }


  const generateButton =
    document.getElementById("generateCatalog");

  if (generateButton) {
    generateButton.textContent =
      t.generateCatalog;
  }


  const publishButton =
    document.querySelector(
      "#seller button[onclick*='publishProduct']"
    );

  if (publishButton) {
    publishButton.textContent =
      t.publishProduct;
  }


  const matchButton =
    document.getElementById("findAIMatches");

  if (matchButton) {
    matchButton.textContent =
      t.findMatches;
  }


  const requestButton =
    document.querySelector(
      "#matchCard button[onclick*='requestToBuy']"
    );

  if (requestButton) {
    requestButton.textContent =
      t.requestBuy;
  }

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function setupImagePreview() {

  const productImage =
    document.getElementById("productImage");

  const imagePreview =
    document.getElementById("imagePreview");

  const uploadPlaceholder =
    document.getElementById("uploadPlaceholder");

  if (!productImage) return;

  productImage.addEventListener(
    "change",
    function () {

      const file = this.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = function (event) {

        if (imagePreview) {

          imagePreview.src =
            event.target.result;

          imagePreview.style.display =
            "block";

        }

        if (uploadPlaceholder) {

          uploadPlaceholder.style.display =
            "none";

        }

      };

      reader.readAsDataURL(file);

    }
  );

}


/* =====================================================
   PRODUCT DATABASE
===================================================== */

function getProductInfo(productName) {

  const name =
    (productName || "").toLowerCase();

  if (
    name.includes("saree") ||
    name.includes("sari") ||
    name.includes("handloom") ||
    name.includes("cotton") ||
    name.includes("చీర") ||
    name.includes("साड़ी")
  ) {

    return {

      name:
        "Handloom Cotton Saree",

      description:
        "Beautifully handcrafted cotton saree made by rural artisans.",

      category:
        "Handloom",

      tags:
        "Cotton, Saree, Handmade, Traditional",

      image:
        "images/craft1.jpg"

    };

  }


  if (
    name.includes("pottery") ||
    name.includes("pot") ||
    name.includes("terracotta") ||
     
