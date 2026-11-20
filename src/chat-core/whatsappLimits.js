/**
 * WhatsApp Cloud API Limits validator.
 * Validates that buttons, list rows, text length conform to WhatsApp Business requirements.
 */

export function validateWhatsAppLimits(m) {
  const issues = [];
  if (!m) return issues;

  if (m.type === "buttons") {
    if (m.buttons && m.buttons.length > 3) {
      issues.push(`buttons: ${m.buttons.length} > 3`);
    }
    m.buttons?.forEach((b) => {
      if (b.title && b.title.length > 20) {
        issues.push(`button title > 20 chars: "${b.title}"`);
      }
    });
    if (m.text && m.text.length > 1024) {
      issues.push("buttons body > 1024 chars");
    }
  }

  if (m.type === "list") {
    const rows = (m.sections || []).flatMap((s) => s.rows || []);
    if (rows.length > 10) {
      issues.push(`list rows: ${rows.length} > 10`);
    }
    if (m.buttonLabel && m.buttonLabel.length > 20) {
      issues.push("list button label > 20 chars");
    }
    rows.forEach((r) => {
      if (r.title && r.title.length > 24) {
        issues.push(`row title > 24 chars: "${r.title}"`);
      }
      if (r.description && r.description.length > 72) {
        issues.push(`row description > 72 chars: "${r.title}"`);
      }
    });
  }

  if (m.type === "text" && m.text && m.text.length > 4096) {
    issues.push("text > 4096 chars");
  }

  if (m.type === "image" && m.caption && m.caption.length > 1024) {
    issues.push("caption > 1024 chars");
  }

  if (issues.length && process.env.NODE_ENV !== "production") {
    console.warn("[WhatsApp limits validation]", m, issues);
  }

  return issues;
}
