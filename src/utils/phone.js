// Small helper to sanitize phone numbers for tel: links
export function sanitizePhone(phone) {
  if (!phone) return null;
  const raw = String(phone).trim();
  if (!raw) return null;

  const hasPlus = raw.startsWith("+");
  // Remove all non-digit characters
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return hasPlus ? `+${digits}` : digits;
}

export default sanitizePhone;
