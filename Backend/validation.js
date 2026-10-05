// Server-side input validation (Security playbook B2 / B5 / B6).
// Every value coming from the client is type-checked, length-limited and,
// where possible, checked against an allow-list. Explicit `typeof` checks
// also prevent NoSQL operator injection such as { "email": { "$ne": null } }.

export const LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 254,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  TITLE_MAX: 200,
  CONTENT_MAX: 50000,
  TAG_MAX_COUNT: 20,
  TAG_MAX_LENGTH: 50,
  SEARCH_MAX: 200,
};

// Must match NOTE_COLORS ids in Frontend/note-app/src/utils/Helper.js
export const NOTE_COLORS = ["default", "amber", "emerald", "sky", "purple", "rose", "orange"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

export const isValidObjectId = (id) => typeof id === "string" && OBJECT_ID_RE.test(id);

const validateEmailField = (email) => {
  if (!isNonEmptyString(email)) return { error: "A valid email is required" };
  const value = email.trim().toLowerCase();
  // Length check first so the regex never runs on huge input.
  if (value.length > LIMITS.EMAIL_MAX || !EMAIL_RE.test(value)) {
    return { error: "Please enter a valid email address" };
  }
  return { value };
};

// Popular disposable / temporary burner email domains to prevent spam accounts
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "tempmail.net",
  "throwawaymail.com",
  "yopmail.com",
  "yopmail.net",
  "trashmail.com",
  "trashmail.net",
  "dispostable.com",
  "getairmail.com",
  "nada.ltd",
  "mohmal.im",
  "mohmal.in",
  "crazymailing.com",
  "mytemp.email",
  "fakeinbox.com",
  "burnermail.io",
]);

/**
 * Normalizes an email address for duplicate prevention.
 * - For Gmail/Googlemail: removes dots and drops "+anything" sub-addressing.
 * - For other domains: drops "+anything" sub-addressing.
 * E.g., "u.s.e.r+spam1@gmail.com" -> "user@gmail.com"
 */
export const normalizeEmail = (rawEmail = "") => {
  if (typeof rawEmail !== "string") return "";
  const trimmed = rawEmail.trim().toLowerCase();
  const atIndex = trimmed.indexOf("@");
  if (atIndex === -1) return trimmed;

  let local = trimmed.slice(0, atIndex);
  let domain = trimmed.slice(atIndex + 1);

  if (domain === "googlemail.com") {
    domain = "gmail.com";
  }

  if (domain === "gmail.com") {
    local = local.replace(/\./g, "");
  }

  const plusIndex = local.indexOf("+");
  if (plusIndex !== -1) {
    local = local.slice(0, plusIndex);
  }

  return `${local}@${domain}`;
};

export const isDisposableEmail = (rawEmail = "") => {
  if (typeof rawEmail !== "string") return false;
  const atIndex = rawEmail.indexOf("@");
  if (atIndex === -1) return false;
  const domain = rawEmail.slice(atIndex + 1).toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
};

export const validateSignup = (body = {}) => {
  const { fullName, email, password, website } = body;

  // Honeypot check: automated bots fill out hidden fields
  if (website && typeof website === "string" && website.trim().length > 0) {
    return { error: "Bot detected. Registration rejected." };
  }

  if (!isNonEmptyString(fullName) || !isNonEmptyString(email) || typeof password !== "string" || !password) {
    return { error: "All fields are required" };
  }

  const name = fullName.trim();
  if (name.length > LIMITS.NAME_MAX) {
    return { error: `Full name must be at most ${LIMITS.NAME_MAX} characters` };
  }

  const emailResult = validateEmailField(email);
  if (emailResult.error) return emailResult;

  if (isDisposableEmail(emailResult.value)) {
    return {
      error: "Disposable or temporary email addresses are not allowed. Please use a permanent email.",
    };
  }

  if (password.length < LIMITS.PASSWORD_MIN) {
    return { error: `Password must be at least ${LIMITS.PASSWORD_MIN} characters` };
  }
  if (password.length > LIMITS.PASSWORD_MAX) {
    return { error: `Password must be at most ${LIMITS.PASSWORD_MAX} characters` };
  }

  const normalized = normalizeEmail(emailResult.value);

  return {
    value: {
      fullName: name,
      email: emailResult.value,
      normalizedEmail: normalized,
      password,
    },
  };
};

export const validateLogin = (body = {}) => {
  const { email, password } = body;
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return { error: "Email and password are required" };
  }
  if (email.length > LIMITS.EMAIL_MAX || password.length > LIMITS.PASSWORD_MAX) {
    return { error: "Invalid email or password" };
  }
  return { value: { email: email.trim().toLowerCase(), password } };
};

const RESET_TOKEN_RE = /^[a-f0-9]{64}$/i;

export const validateForgotPassword = (body = {}) => {
  const { email } = body;
  if (!isNonEmptyString(email)) {
    return { error: "Please enter your email address" };
  }
  const emailResult = validateEmailField(email);
  if (emailResult.error) return emailResult;
  return { value: { email: emailResult.value } };
};

export const validateResetPassword = (body = {}) => {
  const { token, newPassword } = body;
  if (typeof token !== "string" || !RESET_TOKEN_RE.test(token.trim())) {
    return { error: "Invalid or expired reset token" };
  }
  if (typeof newPassword !== "string" || !newPassword) {
    return { error: "New password is required" };
  }
  if (newPassword.length < LIMITS.PASSWORD_MIN) {
    return { error: `Password must be at least ${LIMITS.PASSWORD_MIN} characters` };
  }
  if (newPassword.length > LIMITS.PASSWORD_MAX) {
    return { error: `Password must be at most ${LIMITS.PASSWORD_MAX} characters` };
  }
  return { value: { token: token.trim(), newPassword } };
};

const validateTags = (tags) => {
  if (!Array.isArray(tags)) return { error: "Tags must be an array of strings" };
  if (tags.length > LIMITS.TAG_MAX_COUNT) {
    return { error: `A note can have at most ${LIMITS.TAG_MAX_COUNT} tags` };
  }
  const clean = [];
  for (const tag of tags) {
    if (typeof tag !== "string") return { error: "Tags must be an array of strings" };
    const t = tag.trim();
    if (!t) continue;
    if (t.length > LIMITS.TAG_MAX_LENGTH) {
      return { error: `Each tag must be at most ${LIMITS.TAG_MAX_LENGTH} characters` };
    }
    if (!clean.includes(t)) clean.push(t);
  }
  return { value: clean };
};

/**
 * Validates note fields. With `partial: true` (edits) only the fields that
 * are present are validated/returned; otherwise title + content are required.
 * Unknown fields are ignored (never copied into the database).
 */
export const validateNote = (body = {}, { partial = false } = {}) => {
  const value = {};

  if (body.title !== undefined || !partial) {
    if (!isNonEmptyString(body.title)) return { error: "Title is required" };
    if (body.title.length > LIMITS.TITLE_MAX) {
      return { error: `Title must be at most ${LIMITS.TITLE_MAX} characters` };
    }
    value.title = body.title.trim();
  }

  if (body.content !== undefined || !partial) {
    if (!isNonEmptyString(body.content)) return { error: "Content is required" };
    if (body.content.length > LIMITS.CONTENT_MAX) {
      return { error: `Content must be at most ${LIMITS.CONTENT_MAX} characters` };
    }
    value.content = body.content;
  }

  if (body.tags !== undefined) {
    const tagResult = validateTags(body.tags);
    if (tagResult.error) return tagResult;
    value.tags = tagResult.value;
  }

  for (const field of ["isPinned", "isFavorite", "isArchived"]) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "boolean") return { error: `${field} must be a boolean value` };
      value[field] = body[field];
    }
  }

  if (body.color !== undefined) {
    if (typeof body.color !== "string" || !NOTE_COLORS.includes(body.color)) {
      return { error: "Invalid note color" };
    }
    value.color = body.color;
  }

  if (partial && Object.keys(value).length === 0) {
    return { error: "No valid fields to update" };
  }

  return { value };
};

export const sanitizeSearchQuery = (query) => {
  if (typeof query !== "string") return "";
  return query.trim().slice(0, LIMITS.SEARCH_MAX);
};
