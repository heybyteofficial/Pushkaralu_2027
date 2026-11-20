import { users as initialFamily } from "../data/family";

/**
 * PRODUCTION-GRADE MOCK TRANSPORT FOR PUSHKARALU MISSING PERSONS BOT
 *
 * Implements the full WhatsApp Business state machine:
 * - Family Registration (Consent, Guardian Name, Member Name, Relation list, Age, Gender, Face photo, Marks, Review, Save)
 * - Report Found Person (Face photo, Geolocation, Details, Facial matching against database)
 * - Automated Alerts & Guardian Confirmation (Face match comparison, Secure call connect, Google Maps card)
 * - My Family Management (View members, Mark missing, Found safe, Delete/Remove)
 * - My Cases & Tracking
 * - Helplines & Emergency Numbers
 * - Language Selection (English, Telugu, Hindi)
 * - Persistent storage across page reloads via localStorage
 */

const RELATIONS = [
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Spouse",
  "Grandfather",
  "Grandmother",
  "Brother",
  "Sister",
  "Other",
];

const GREETINGS = /^(hi|hii+|hello|hey|start|namaste|namaskaram|హాయ్|నమస్తే)$/i;

const uid = (prefix = "ID") =>
  `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

const fmtTime = (t = Date.now()) =>
  new Date(t).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

const STORAGE_KEYS = {
  FAMILY: "pushkaralu_wa_family",
  CASES: "pushkaralu_wa_cases",
  GUARDIAN: "pushkaralu_wa_guardian",
  FAMILY_ID: "pushkaralu_wa_family_id",
  LANG: "pushkaralu_wa_lang",
};

export function createMockTransport() {
  // Load persistent state or prefill with family members from family.js
  const storedFamily = (() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAMILY);
      if (data) return JSON.parse(data);
    } catch (e) {}
    // Seed with existing family data from Pushkaralu project
    return initialFamily.map((m) => ({
      id: `MEM-${m.id}`,
      name: m.name,
      nameTe: m.nameTe,
      relation: m.relation,
      age: m.age,
      gender: m.gender,
      photo: m.avatar,
      marks: m.relation === "Father" ? "Silver watch on left wrist" : m.relation === "Son" ? "Small birthmark on right arm" : "None",
      status: "safe", // 'safe' | 'missing'
    }));
  })();

  const storedCases = (() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [
      {
        id: "CASE-G7102",
        kind: "found",
        title: "Pilgrim Assistance Alert — Durga Ghat",
        status: "matched",
        at: Date.now() - 3600000 * 3,
      },
    ];
  })();

  const s = {
    step: "menu",
    consent: true,
    guardianName: localStorage.getItem(STORAGE_KEYS.GUARDIAN) || "Venkateswara Rao",
    familyId: localStorage.getItem(STORAGE_KEYS.FAMILY_ID) || "FAM-AP924",
    lang: localStorage.getItem(STORAGE_KEYS.LANG) || "en",
    family: storedFamily,
    cases: storedCases,
    draft: {},
    found: {},
    pendingMatch: null,
    selectedId: "",
  };

  const saveState = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(s.family));
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(s.cases));
      if (s.guardianName) localStorage.setItem(STORAGE_KEYS.GUARDIAN, s.guardianName);
      if (s.familyId) localStorage.setItem(STORAGE_KEYS.FAMILY_ID, s.familyId);
      if (s.lang) localStorage.setItem(STORAGE_KEYS.LANG, s.lang);
    } catch (e) {}
  };

  const menuBtn = { id: "menu", title: "🏠 Main menu" };

  // ---------- Menu Generation ----------
  const menu = (greet = false) => {
    s.step = "menu";
    const out = [];

    if (greet) {
      out.push({
        type: "text",
        text:
          "🙏 *Namaskaram! Welcome to Andhra Pradesh Pushkaralu 2027 Missing Persons & Citizen Assistance.*\n\n" +
          "Official helpline powered by Government of Andhra Pradesh Police and Rapid Response System.\n\n" +
          "Register your family once with verified face photos. If anyone gets separated in the crowd, any volunteer or police patrol can photograph them and alert you instantly.",
      });
    }

    out.push({
      type: "list",
      header: "Government Citizen Assistance",
      text: "How can we assist you today?",
      footer: "Type 'menu' anytime to return here",
      buttonLabel: "Choose service",
      sections: [
        {
          title: "Family Protection",
          rows: [
            {
              id: "m_register",
              title: "Register family",
              description: "Add family members with face photos for instant identification",
            },
            {
              id: "m_family",
              title: "My family",
              description: `View ${s.family.length} members, report missing, or mark safe`,
            },
          ],
        },
        {
          title: "Public Assistance",
          rows: [
            {
              id: "m_found",
              title: "Report found person",
              description: "Upload face photo to search database & notify guardian",
            },
          ],
        },
        {
          title: "Help & Information",
          rows: [
            { id: "m_cases", title: "My cases", description: "Track active alerts and search status" },
            { id: "m_help", title: "Emergency helplines", description: "Direct access to Police, Ambulance & SOS" },
            { id: "m_lang", title: "Change language", description: "English · తెలుగు · हिन्दी" },
          ],
        },
      ],
    });

    return out;
  };

  // ---------- Register Family Flow ----------
  const startRegister = () => {
    if (!s.consent) {
      s.step = "reg_consent";
      return [
        {
          type: "buttons",
          header: "🔐 Data Privacy & Consent",
          text:
            "Your family's privacy and safety are fully safeguarded:\n\n" +
            "• Photos and biometric markers are stored *strictly* to identify individuals if lost during Pushkaralu.\n" +
            "• Photos are *never* published publicly.\n" +
            "• Personal phone numbers are masked through secure government lines.\n" +
            "• You may delete your family profile anytime.\n\nDo you consent to proceed?",
          buttons: [
            { id: "c_yes", title: "✅ I agree" },
            { id: "c_no", title: "No, go back" },
          ],
        },
      ];
    }

    if (!s.guardianName) {
      s.step = "reg_guardian_name";
      return [{ type: "text", text: "Please type *your full name* (you will be designated as the primary family guardian)." }];
    }

    return askMemberName();
  };

  const askMemberName = () => {
    s.step = "reg_name";
    s.draft = {};
    return [
      {
        type: "text",
        text: `👤 *Family Member ${s.family.length + 1}*\n\nPlease type the *full name* of this family member.`,
      },
    ];
  };

  const memberCaption = (m) =>
    `*${m.name}*\n${m.relation} · ${m.age} yrs · ${m.gender}` +
    (m.marks && m.marks !== "None" ? `\n🔖 Identifying marks: ${m.marks}` : "");

  // ---------- Report Found Person Flow ----------
  const startFound = () => {
    s.step = "found_photo";
    s.found = {};
    return [
      {
        type: "request_image",
        text:
          "📸 Please take or upload a *clear photo of the person's face*.\n\n" +
          "✅ Ensure face is front-facing and clearly lit\n" +
          "❌ Avoid group photos, hats, or dark shadows\n\n" +
          "Please remain calm and escort them to the nearest safe pilgrim information desk or police outpost.",
        buttonLabel: "Take photo",
      },
    ];
  };

  const runSearch = () => {
    const caseId = uid("CASE");
    // Prioritize family members currently marked missing, then safe
    const candidates = [...s.family].sort(
      (a, b) => (a.status === "missing" ? -1 : 0) - (b.status === "missing" ? -1 : 0)
    );
    const match = candidates[0];

    const searching = {
      type: "text",
      text: "🔎 *Searching Pushkaralu facial registry…*\nMatching against verified family records and police registry. Please wait a moment.",
    };

    if (!match) {
      s.cases.unshift({
        id: caseId,
        kind: "found",
        title: "Found person report",
        status: "open",
        at: Date.now(),
      });
      saveState();
      s.step = "menu";
      return [
        searching,
        {
          type: "buttons",
          delayMs: 2000,
          text:
            `📁 *No immediate match found in active registry.*\n\n` +
            `Your report has been logged with the Pushkaralu Central Command Center.\n` +
            `🆔 Case ID: *${caseId}*\n\n` +
            `If a guardian registers or reports this individual missing, an automated dispatch will be triggered.\n\n` +
            `🚨 Police Control: *112*\n👶 Childline: *1098*\n🚑 Ambulance: *108*`,
          footer: "You can register your own family anytime",
          buttons: [menuBtn, { id: "m_register", title: "Register family" }],
        },
      ];
    }

    const similarity = (93.5 + Math.random() * 5.8).toFixed(1);
    s.cases.unshift({
      id: caseId,
      kind: "found",
      title: `Possible match: ${match.name}`,
      status: "open",
      at: Date.now(),
    });
    s.pendingMatch = { memberId: match.id, caseId };
    s.step = "guardian_confirm";
    saveState();

    return [
      searching,
      {
        type: "text",
        delayMs: 2200,
        text:
          `✅ *High-Confidence Match Identified!*\n\n` +
          `The registered guardian and Andhra Pradesh Police Control Room have been notified.\n` +
          `Your phone number remains confidential and protected.\n\n` +
          `🆔 Case ID: *${caseId}*\n\n` +
          `🙏 Please stay with the person in a safe public place. For urgent assistance, dial *112*.`,
      },
      {
        type: "image",
        delayMs: 1200,
        url: s.found.photo || match.photo,
        caption:
          `🚨 *POLICE & GUARDIAN ALERT: Facial Match Detected*\n\n` +
          `A volunteer located an individual matching *${match.name}* (*${similarity}% facial similarity score*).\n` +
          `🕐 Reported: ${fmtTime()}` +
          (s.found.details ? `\n📝 Volunteer note: "${s.found.details}"` : ""),
      },
      {
        type: "image",
        url: match.photo,
        caption: `Official registered profile photo of *${match.name}*`,
      },
      {
        type: "buttons",
        text: `Please confirm: Is this *${match.name}*?`,
        buttons: [
          { id: "g_yes", title: "✅ Yes, it's them" },
          { id: "g_no", title: "❌ Not them" },
        ],
      },
    ];
  };

  // ---------- My Family Flow ----------
  const showFamily = () => {
    if (!s.family.length) {
      s.step = "menu";
      return [
        {
          type: "buttons",
          text: "No family members registered yet under your profile.",
          buttons: [{ id: "m_register", title: "Register family" }, menuBtn],
        },
      ];
    }

    s.step = "fam_pick";
    const rows = s.family.slice(0, 10).map((m) => ({
      id: m.id,
      title: m.name.slice(0, 24),
      description: `${m.relation} · ${m.age} yrs · ${m.status === "missing" ? "🔴 MISSING" : "🟢 Safe"}`,
    }));

    return [
      {
        type: "list",
        header: "👨‍👩‍👧 Pushkaralu Family Registry",
        text:
          `Family ID: *${s.familyId}*\n` +
          `Guardian: *${s.guardianName}*\n` +
          `Registered Members: *${s.family.length}*\n\n` +
          `Select a family member to view their profile, mark them missing, or update status.`,
        buttonLabel: "View members",
        sections: [{ title: "Family Members", rows }],
      },
    ];
  };

  const memberActions = (m) => {
    s.step = "fam_action";
    s.selectedId = m.id;
    return [
      {
        type: "image",
        url: m.photo,
        caption:
          memberCaption(m) +
          `\nCurrent Status: ${m.status === "missing" ? "🔴 REPORTED MISSING" : "🟢 SAFE"}`,
      },
      {
        type: "buttons",
        text: `Select an action for *${m.name}*:`,
        buttons:
          m.status === "safe"
            ? [
                { id: "f_missing", title: "🚨 Mark missing" },
                { id: "f_remove", title: "🗑 Remove" },
                menuBtn,
              ]
            : [
                { id: "f_safe", title: "✅ Found safe" },
                menuBtn,
              ],
      },
    ];
  };

  // ---------- Router ----------
  const route = (id) => {
    switch (id) {
      case "menu":
        return menu();
      case "m_register":
        return startRegister();
      case "m_found":
        return startFound();
      case "m_family":
        return showFamily();
      case "m_cases": {
        s.step = "menu";
        return [
          {
            type: "buttons",
            text: s.cases.length
              ? "📂 *Active & Past Cases*\n\n" +
                s.cases
                  .map(
                    (c) =>
                      `• *${c.id}* — ${c.title}\n   Status: ${c.status.toUpperCase()} · ${fmtTime(c.at)}`
                  )
                  .join("\n\n")
              : "📂 You have no active or historical cases logged.",
            buttons: [menuBtn],
          },
        ];
      }
      case "m_help": {
        s.step = "menu";
        return [
          {
            type: "buttons",
            text:
              "📞 *Pushkaralu 2027 Emergency Helplines*\n\n" +
              "🚨 Central Emergency: *112*\n" +
              "🚓 Police Control Room: *100*\n" +
              "🚑 Ambulance / Medical: *108*\n" +
              "👶 Childline: *1098*\n" +
              "👩 Women Safety: *181*\n" +
              "👴 Elder Assistance: *14567*\n" +
              "🌊 Water Rescue Team: *1070*",
            buttons: [menuBtn],
          },
        ];
      }
      case "m_lang": {
        s.step = "lang";
        return [
          {
            type: "list",
            header: "Language / భాష / भाषा",
            text: "Choose your preferred language / మీ ప్రాధాన్య భాషను ఎంచుకోండి / अपनी भाषा चुनें",
            buttonLabel: "Select language",
            sections: [
              {
                title: "Languages",
                rows: [
                  { id: "l_en", title: "English" },
                  { id: "l_te", title: "తెలుగు (Telugu)" },
                  { id: "l_hi", title: "हिन्दी (Hindi)" },
                ],
              },
            ],
          },
        ];
      }
      default:
        return null;
    }
  };

  const reprompt = (text) => [{ type: "text", text }];

  // ---------- Main Message Handler ----------
  const handle = (r) => {
    const text = r.type === "text" ? r.text.trim() : "";
    const choice =
      r.type === "button_reply"
        ? r.buttonId
        : r.type === "list_reply"
        ? r.rowId
        : "";

    if (GREETINGS.test(text)) return menu(true);
    if (/^menu$/i.test(text)) return menu();
    if (/^cancel$/i.test(text)) {
      s.step = "menu";
      return [{ type: "text", text: "❎ Current operation cancelled." }, ...menu()];
    }

    if (choice) {
      const routed = route(choice);
      if (routed) return routed;
    }

    switch (s.step) {
      case "menu":
        return [
          { type: "text", text: "Please choose an option from the menu below 👇" },
          ...menu(),
        ];

      case "reg_consent":
        if (choice === "c_yes") {
          s.consent = true;
          return startRegister();
        }
        return menu();

      case "reg_guardian_name":
        if (text.length < 2) return reprompt("Please enter a valid full name.");
        s.guardianName = text;
        s.familyId = uid("FAM");
        saveState();
        return [
          {
            type: "text",
            text: `Thank you, *${text}* 🙏 You are registered as primary guardian. Now let's register your family members.`,
          },
          ...askMemberName(),
        ];

      case "reg_name":
        if (text.length < 2) return reprompt("Please enter the member's full name.");
        s.draft.name = text;
        s.step = "reg_relation";
        return [
          {
            type: "list",
            header: "Family Relationship",
            text: `What is *${text}*'s relation to you?`,
            buttonLabel: "Select relation",
            sections: [
              {
                title: "Relationship",
                rows: RELATIONS.map((x) => ({ id: `rel_${x}`, title: x })),
              },
            ],
          },
        ];

      case "reg_relation":
        if (!choice.startsWith("rel_")) {
          return reprompt("Please tap *Select relation* and choose one.");
        }
        s.draft.relation = choice.slice(4);
        s.step = "reg_age";
        return reprompt(`🎂 What is *${s.draft.name}*'s age in years?`);

      case "reg_age": {
        const age = Number(text);
        if (!Number.isInteger(age) || age < 0 || age > 120) {
          return reprompt("Please enter a valid age as a number (e.g. *12*).");
        }
        s.draft.age = age;
        s.step = "reg_gender";
        return [
          {
            type: "buttons",
            text: `What is the gender of *${s.draft.name}*?`,
            buttons: [
              { id: "g_Male", title: "Male" },
              { id: "g_Female", title: "Female" },
              { id: "g_Other", title: "Other" },
            ],
          },
        ];
      }

      case "reg_gender":
        if (!choice.startsWith("g_")) return reprompt("Please select one of the gender buttons above.");
        s.draft.gender = choice.slice(2);
        s.step = "reg_photo";
        return [
          {
            type: "request_image",
            text:
              `📸 Upload a *clear front-facing photo* of ${s.draft.name}.\n\n` +
              "✅ Good lighting, full face visible\n" +
              "✅ Recent photo\n" +
              "❌ No sunglasses, masks, or group pictures",
            buttonLabel: "Upload photo",
          },
        ];

      case "reg_photo":
        if (r.type !== "image") {
          return reprompt("Please provide a photo using the 📎 attachment or 📷 camera button.");
        }
        s.draft.photo = r.previewUrl;
        s.step = "reg_marks";
        return [
          {
            type: "buttons",
            text:
              "🔖 Any *distinctive identifying marks*?\n(e.g., mole on left cheek, scar, birthmark, glasses…)\n\nType them in message or tap *Skip*.",
            buttons: [{ id: "skip", title: "Skip" }],
          },
        ];

      case "reg_marks":
        if (choice !== "skip") {
          if (!text) return reprompt("Please describe any marks, or tap *Skip*.");
          s.draft.marks = text;
        } else {
          s.draft.marks = "None";
        }
        s.step = "reg_review";
        return [
          {
            type: "image",
            url: s.draft.photo,
            caption: memberCaption(s.draft),
          },
          {
            type: "buttons",
            text: "Please review the details above. Is everything correct?",
            buttons: [
              { id: "r_save", title: "✅ Save member" },
              { id: "r_redo", title: "✏️ Re-enter" },
            ],
          },
        ];

      case "reg_review":
        if (choice === "r_redo") return askMemberName();
        if (choice !== "r_save") return reprompt("Please tap *Save member* or *Re-enter*.");

        s.family.push({
          ...s.draft,
          id: uid("MEM"),
          status: "safe",
        });
        saveState();
        s.step = "reg_more";
        return [
          {
            type: "buttons",
            text: `✅ *${s.draft.name}* successfully registered in the Pushkaralu facial security database.\n\nWould you like to add another family member?`,
            buttons: [
              { id: "more_add", title: "➕ Add another" },
              { id: "more_done", title: "✅ Done" },
            ],
          },
        ];

      case "reg_more":
        if (choice === "more_add") return askMemberName();
        s.step = "menu";
        return [
          {
            type: "buttons",
            text:
              `🎉 *Family Registration Complete!*\n\n` +
              `🆔 Family ID: *${s.familyId}*\n` +
              `👤 Primary Guardian: *${s.guardianName}*\n` +
              `👨‍👩‍👧 Total Members: *${s.family.length}* (${s.family.map((m) => m.name).join(", ")})\n\n` +
              `If any member ever gets separated in the ghats, open *My family* → *Mark missing* immediately.`,
            buttons: [menuBtn, { id: "m_family", title: "My family" }],
          },
        ];

      case "found_photo":
        if (r.type !== "image") {
          return reprompt("Please upload or capture a photo of the person's face 📷");
        }
        s.found.photo = r.previewUrl;
        s.step = "found_location";
        return [
          {
            type: "request_location",
            text: "📍 Share the *exact location* where you found this person.",
          },
        ];

      case "found_location":
        if (r.type !== "location") return reprompt("Please tap *Send location* 📍");
        s.found.lat = r.lat;
        s.found.lng = r.lng;
        s.step = "found_details";
        return [
          {
            type: "buttons",
            text:
              "📝 Any additional details that can help identify them?\n" +
              '_e.g., "Wearing blue shirt, speaks Telugu, sitting near Durga Ghat stairs"_\n\n' +
              "Type your observation or tap *Skip*.",
            buttons: [{ id: "skip", title: "Skip" }],
          },
        ];

      case "found_details":
        if (choice !== "skip" && text) s.found.details = text;
        return runSearch();

      case "guardian_confirm": {
        const pm = s.pendingMatch;
        const m = s.family.find((x) => x.id === pm?.memberId);
        const c = s.cases.find((x) => x.id === pm?.caseId);
        s.pendingMatch = null;
        s.step = "menu";

        if (choice === "g_yes" && m && c) {
          m.status = "safe";
          c.status = "resolved";
          saveState();
          return [
            {
              type: "text",
              text:
                `🙏 *Reunion in Progress!*\n\n` +
                `You have confirmed that *${m.name}* is matched. Connecting you to the volunteer via an encrypted line. Both mobile numbers remain shielded.\n\n` +
                `Exact location where ${m.name} is waiting safely:`,
            },
            {
              type: "location",
              lat: s.found.lat ?? 16.5144,
              lng: s.found.lng ?? 80.6206,
              name: `${m.name} is waiting here`,
              address: `Durga Ghat Area · Case ${c.id}`,
            },
            {
              type: "buttons",
              text: "A volunteer officer will initiate contact in under 2 minutes.",
              buttons: [{ id: "call", title: "📞 Call Helpline" }, menuBtn],
            },
          ];
        }

        return [
          {
            type: "buttons",
            text: "Confirmed: Marked as *not a match*. We are expanding the facial search to regional control registries.",
            buttons: [menuBtn],
          },
        ];
      }

      case "fam_pick": {
        const m = s.family.find((x) => x.id === choice);
        if (!m) return reprompt("Please tap *View members* and select a person.");
        return memberActions(m);
      }

      case "fam_action": {
        const m = s.family.find((x) => x.id === s.selectedId);
        if (!m) return menu();

        if (choice === "f_missing") {
          s.step = "miss_location";
          return [
            {
              type: "request_location",
              text: `📍 Where was *${m.name}* last seen? Please share the approximate or current location.`,
            },
          ];
        }

        if (choice === "f_safe") {
          m.status = "safe";
          s.cases
            .filter((c) => c.kind === "missing" && c.title.includes(m.name))
            .forEach((c) => (c.status = "closed"));
          saveState();
          s.step = "menu";
          return [
            {
              type: "buttons",
              text: `💚 Wonderful news! *${m.name}* is confirmed safe and all active alerts have been resolved.`,
              buttons: [menuBtn],
            },
          ];
        }

        if (choice === "f_remove") {
          s.step = "fam_remove";
          return [
            {
              type: "buttons",
              text: `Remove *${m.name}* from your family profile? Their photos and facial data will be permanently wiped.`,
              buttons: [
                { id: "rm_yes", title: "🗑 Yes, delete" },
                { id: "rm_no", title: "Cancel" },
              ],
            },
          ];
        }

        return reprompt("Please tap one of the action buttons above.");
      }

      case "fam_remove": {
        const m = s.family.find((x) => x.id === s.selectedId);
        if (choice === "rm_yes" && m) {
          s.family = s.family.filter((x) => x.id !== m.id);
          saveState();
          s.step = "menu";
          return [
            {
              type: "buttons",
              text: `🗑 *${m.name}* has been removed from your registry.`,
              buttons: [menuBtn],
            },
          ];
        }
        return showFamily();
      }

      case "miss_location":
        if (r.type !== "location") return reprompt("Please tap *Send location* 📍");
        s.step = "miss_time";
        return reprompt(
          `🕐 When and where was the person last seen?\n_e.g., "Today around 11:30 AM near Ghat #3 ticket counter, wearing yellow kurta"_`
        );

      case "miss_time": {
        const m = s.family.find((x) => x.id === s.selectedId);
        if (!m) return menu();
        m.status = "missing";
        const caseId = uid("CASE");
        s.cases.unshift({
          id: caseId,
          kind: "missing",
          title: `${m.name} reported missing`,
          status: "open",
          at: Date.now(),
        });
        saveState();
        s.step = "menu";
        return [
          {
            type: "buttons",
            text:
              `🚨 *MISSING PERSON ALERT ACTIVATED FOR ${m.name.toUpperCase()}*\n\n` +
              `🆔 Case ID: *${caseId}*\n` +
              `🕐 Last Seen: ${text || "Reported just now"}\n\n` +
              `Every photo captured by volunteers, police personnel, and AI ghat cameras is now cross-matched against ${m.name}'s biometric profile.\n\n` +
              `You will receive an instant WhatsApp alert the second a match is verified.\n\n` +
              `🚓 Police Dispatch has been notified. You can also dial *112* directly.`,
            buttons: [menuBtn, { id: "m_found", title: "Report found person" }],
          },
        ];
      }

      case "lang": {
        const names = { l_en: "English", l_te: "తెలుగు", l_hi: "हिन्दी" };
        s.lang = choice.slice(2) || "en";
        saveState();
        s.step = "menu";
        return [
          {
            type: "text",
            text: `✅ Language set to *${names[choice] || "English"}*. All updates and responses will be delivered accordingly.`,
          },
          ...menu(),
        ];
      }
    }

    return menu();
  };

  return {
    start: async () => menu(true),
    send: async (r) => handle(r),
  };
}
