import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    appName: 'VrikshaSetu',
    tagline: 'Tree Survival, Not Just Plantation',
    teamBadge: 'Hackathon 6.0 • Team Pandas Py (Jamshedpur)',
    nav: {
      dashboard: 'Dashboard',
      map: 'GIS Survival Map',
      trees: 'Sapling Directory',
      drives: 'CSR Escrow & Drives',
      guardian: 'Guardian Portal',
      rewards: 'Credits & Leaderboard',
      pitch: 'Judge Pitch Deck',
      scanQR: 'Scan QR',
      registerTree: '+ Register Tree',
    },
    hero: {
      title: 'Tree Survival,',
      titleHighlight: 'Not Just Plantation',
      description: 'In India, millions of saplings die within two years due to "Plant & Forget" drives. VrikshaSetu secures genuine longevity through AI computer vision health scoring, geofenced verification, community guardianship, and milestone-locked CSR escrow funding.',
      launchAI: 'Launch Live AI Health Analyzer',
      exploreEscrow: 'Explore Milestone CSR Escrow',
    },
    kpi: {
      trueSurvival: 'True Survival Rate',
      verified: 'Verified',
      vsNational: 'vs 22% traditional national average',
      livingSaplings: 'Living Saplings',
      thriving: 'thriving with high ExG',
      adoptedGuardianship: 'Adopted Guardianship',
      activeCaretakers: 'active caretakers',
      co2Absorbed: 'CO₂ Absorbed',
      derivedFrom: 'Derived from canopy & height',
      milestoneEscrow: 'Milestone Escrow',
      lockedAudit: 'locked until survival audit',
    },
    actions: {
      adopt: 'Adopt This Tree',
      passport: 'Digital Passport',
      careLog: 'Log Care / AI Scan',
      officialQR: 'Official QR Passport',
      audioGuide: 'Listen to Care Audio',
      speaking: 'Playing Voice Guide...',
      stopAudio: 'Stop Audio',
    },
    audioTextTemplate: (commonName, species, wateringDays, score) => 
      `Attention tree guardian! Here is the care advisory for your ${commonName}, botanical name ${species}. Current health score is ${score} percent. Please provide eight liters of fresh water every ${wateringDays} days. Ensure organic mulching around the root collar to preserve soil moisture in the Jharkhand heat. Report any stem discoloration using the AI scanner. Thank you for protecting our green canopy!`,
  },
  hi: {
    appName: 'वृक्ष सेतु',
    tagline: 'सिर्फ पौधरोपण नहीं, वृक्ष जीवन रक्षा',
    teamBadge: 'हैकाथॉन 6.0 • टीम पांडाज पाई (जमशेदपुर)',
    nav: {
      dashboard: 'डैशबोर्ड',
      map: 'जीआईएस मैप',
      trees: 'पौधा डायरेक्टरी',
      drives: 'सीएसआर एस्क्रो',
      guardian: 'अभिभावक पोर्टल',
      rewards: 'रिवॉर्ड्स व क्रेडिट्स',
      pitch: 'जज पिच डेक',
      scanQR: 'क्यूआर स्कैन',
      registerTree: '+ नया पौधा जोड़ें',
    },
    hero: {
      title: 'सिर्फ पौधरोपण नहीं,',
      titleHighlight: 'वृक्ष जीवन रक्षा',
      description: 'भारत में "पेड़ लगाओ और भूल जाओ" की वजह से लाखों पौधे दो साल में सूख जाते हैं। वृक्ष सेतु एआई कंप्यूटर विज़न, जियोफेंस सत्यापन, जन-भागीदारी और माइलस्टोन आधारित सीएसआर एस्क्रो फंडिंग से पौधों की दीर्घायु सुनिश्चित करता है।',
      launchAI: 'लाइव एआई स्वास्थ्य स्कैनर खोलें',
      exploreEscrow: 'माइलस्टोन सीएसआर एस्क्रो देखें',
    },
    kpi: {
      trueSurvival: 'सत्यापित उत्तरजीविता दर',
      verified: 'सत्यापित',
      vsNational: 'पारंपरिक 22% राष्ट्रीय औसत की तुलना में',
      livingSaplings: 'जीवित पौधे',
      thriving: 'स्वस्थ और हरा-भरा',
      adoptedGuardianship: 'दत्तक अभिभावक',
      activeCaretakers: 'सक्रिय वन रक्षक',
      co2Absorbed: 'अवशोषित कार्बन (CO₂)',
      derivedFrom: 'ऊंचाई व कैनोपी से आकलित',
      milestoneEscrow: 'एस्क्रो सुरक्षित फंड',
      lockedAudit: 'ऑडिट तक बैंक में सुरक्षित',
    },
    actions: {
      adopt: 'इस पौधे को गोद लें',
      passport: 'डिजिटल पासपोर्ट',
      careLog: 'देखभाल / एआई स्कैन',
      officialQR: 'आधिकारिक क्यूआर कोड',
      audioGuide: 'आवाज़ में सुनें (ऑडियो गाइड)',
      speaking: 'ऑडियो चल रहा है...',
      stopAudio: 'ऑडियो बंद करें',
    },
    audioTextTemplate: (commonName, species, wateringDays, score) => 
      `नमस्कार वन रक्षक जी! आपके ${commonName} के पौधे का स्वास्थ्य स्कोर ${score} प्रतिशत है। झारखंड के मौसम को देखते हुए इसे हर ${wateringDays} दिन में 8 से 10 लीटर पानी दें। जड़ों के चारों तरफ सूखी पत्तियों से मल्चिंग अवश्य करें ताकि नमी बनी रहे। किसी भी कीट या रोग के लक्षण दिखने पर तुरंत एआई कैमरे से स्कैन करें। वृक्ष सेतु से जुड़ने के लिए धन्यवाद!`,
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = translations[lang] || translations.en;

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakCareGuide = (commonName, species, wateringDays = 3, score = 90) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const text = t.audioTextTemplate(commonName, species, wateringDays, score);
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, speakCareGuide, stopSpeaking, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
