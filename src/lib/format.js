export function maskEmail(email) {
  const value = String(email ?? "").trim();

  if (!value) {
    return "";
  }

  const [local, domain] = value.split("@");

  if (!local || !domain) {
    return value;
  }

  return `${local.slice(0, 1)}•••@${domain}`;
}

export function normalizeImageUrl(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
