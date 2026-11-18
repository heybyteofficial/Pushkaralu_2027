const GUIDES = [
  {
    id: "missing",
    chip: "Missing person",
    keywords: ["missing", "lost", "child", "తప్పిపో"],
    collect: "missing",
    reply:
      "Take a photo of yourself so the admin can find you.\nమిమ్మల్ని కనుగొనేందుకు మీ ఫోటో తీయండి.",
    buttons: [{ id: "camera", label: "Open camera" }],
  },
  {
    id: "emergency",
    chip: "Emergency",
    keywords: ["emergency", "sos", "ambulance", "police", "accident", "అత్యవసర"],
    reply:
      "What is the emergency?\nఅత్యవసరం ఏమిటి?",
    buttons: [
      { id: "type-medical", label: "Medical" },
      { id: "type-accident", label: "Accident" },
      { id: "type-police", label: "Police" },
    ],
  },
];

const VOICE_GUIDE = {
  id: "voice",
  reply:
    "I got your voice note. Select Missing person or Emergency below.\nమీ వాయిస్ నోట్ వచ్చింది. కింద మిస్సింగ్ లేదా అత్యవసరం ఎంచుకోండి.",
};

const FALLBACK_GUIDE = {
  id: "menu",
  reply:
    "I can help with a missing person or an emergency. Select one below.\nతప్పిపోయిన వ్యక్తి లేదా అత్యవసర సహాయం కోసం కింద ఎంచుకోండి.",
};

function matchGuide(text) {
  const value = text.toLowerCase();
  return GUIDES.find((guide) => guide.keywords.some((keyword) => value.includes(keyword))) || null;
}

export { FALLBACK_GUIDE, GUIDES, VOICE_GUIDE, matchGuide };
