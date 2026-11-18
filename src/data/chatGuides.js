const GUIDES = [
  {
    id: "missing",
    chip: "Missing person",
    chipTe: "మిస్సింగ్ వ్యక్తి",
    keywords: ["missing", "lost", "child", "తప్పిపో"],
    collect: "missing",
    reply: {
      en: "Please send a photo of yourself so the missing-person admin can find you.",
      te: "మిస్సింగ్ వ్యక్తి అడ్మిన్ మిమ్మల్ని కనుగొనేందుకు మీ ఫోటో పంపండి.",
    },
    buttons: [{ id: "camera", label: "Open camera", labelTe: "కెమెరా తెరవండి" }],
  },
  {
    id: "emergency",
    chip: "Emergency",
    chipTe: "అత్యవసరం",
    keywords: ["emergency", "sos", "ambulance", "police", "accident", "అత్యవసర"],
    reply: {
      en: "Please select the type of emergency.",
      te: "అత్యవసరం రకాన్ని ఎంచుకోండి.",
    },
    buttons: [
      { id: "type-medical", label: "Medical", labelTe: "వైద్యం" },
      { id: "type-accident", label: "Accident", labelTe: "ప్రమాదం" },
      { id: "type-police", label: "Police", labelTe: "పోలీసు" },
    ],
  },
];

const VOICE_GUIDE = {
  id: "voice",
  reply: {
    en: "Your voice note is received. Please choose a service.",
    te: "మీ వాయిస్ నోట్ అందింది. దయచేసి ఒక సేవను ఎంచుకోండి.",
  },
  buttons: [{ id: "choose-service", label: "Choose Service", labelTe: "సేవను ఎంచుకోండి" }],
};

const FALLBACK_GUIDE = {
  id: "menu",
  reply: {
    en: "Please choose a service, or type TE for Telugu and EN for English.",
    te: "దయచేసి ఒక సేవను ఎంచుకోండి. తెలుగు కోసం TE, ఇంగ్లీష్ కోసం EN అని పంపండి.",
  },
  buttons: [{ id: "choose-service", label: "Choose Service", labelTe: "సేవను ఎంచుకోండి" }],
};

function matchGuide(text) {
  const value = text.toLowerCase();
  return GUIDES.find((guide) => guide.keywords.some((keyword) => value.includes(keyword))) || null;
}

export { FALLBACK_GUIDE, GUIDES, VOICE_GUIDE, matchGuide };
