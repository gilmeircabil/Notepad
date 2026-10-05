# Security Agent Playbook

**How to use this file:** Paste or reference this whole file to an AI coding
assistant (Claude, Claude Code, etc.) inside your project, then say something
like: *"Read SECURITY_AGENT_PLAYBOOK.md and audit/implement my project against
it. Go section by section, tell me what's missing, and fix it in the code."*

The AI should treat every section below as a set of **tasks to perform on the
actual codebase**, not just background reading. For each numbered item the AI
should:

1. Search the project for whether the control already exists.
2. If it exists, verify it's implemented correctly.
3. If it's missing or weak, implement it (or clearly flag it if it needs a
   decision only the developer can make — e.g. which legal jurisdiction
   applies).
4. Report status per item as `✅ Done`, `⚠️ Partially done (+ why)`, `❌ Missing`,
   or `N/A (+ why)`.

This playbook is defensive security guidance only: it helps you protect your
own website, API, or desktop application. It is not a guarantee of legal
compliance — for regulated or sensitive projects, get professional legal and
security review too.

---

## 0. Instructions for the AI Agent

When asked to run this playbook against a repository, do the following in order:

- [ ] Detect the project type (website/API backend, frontend, desktop app such
      as Electron, or a mix) and the stack in use (e.g. MERN, Electron +
      SQLite, etc.).
- [ ] Work through **Part A (Architecture & Mindset)** first to understand the
      system's data flow and trust boundaries before changing code.
- [ ] Work through **Part B (Implementation Checklist)** section by section as
      a **dry-run audit first**: for each item, report its status (`✅ Done`,
      `⚠️ Partially done (+ why)`, `❌ Missing`, or `N/A (+ why)`) **without
      making any code changes yet**.
- [ ] **Present the full audit report and wait for the user's approval**
      before editing any code. The user may approve all fixes, select specific
      items, or ask questions first.
- [ ] After approval, make concrete code/config changes for the approved
      items (e.g. adding input validation, parameterized queries, security
      headers, `.env` usage, rate limiting middleware).
- [ ] For anything that needs a human decision (legal policies, business
      rules, which MFA provider, hosting choice, etc.), don't guess — surface
      it as an explicit question or a `TODO` with an explanation.
- [ ] Never hardcode secrets while "fixing" something — always move secrets to
      environment variables / a secrets manager and reference them.
- [ ] After implementation, run **Part C (Testing & Verification)**.
- [ ] Finish with **Part D (Checklists)** filled in as a status report, plus a
      short summary of what changed and what still needs the developer's
      attention.

---

## Part 0.5 — Which Sections Apply to My Stack

Before running the checklist, the AI should classify the project against the
table below and only apply the matching rows. **Part A and the "Universal"
row always apply, everywhere, with no exceptions.**

| Your stack | Always apply | Also apply | Skip |
|---|---|---|---|
| **Website / web app** (browser + backend) | Universal, B1–B9, B12–B16, C, D | — | B10, B11 (Electron/local-DB specific) |
| **Desktop app** (e.g. Electron, Tauri) | Universal, B9, B10, C, D | B1 (if it embeds a web UI), B5, B6 | B12 (HTTP headers), B15 (CORS/cookies) — unless it also talks to a web API |
| **Desktop app + local database** (e.g. SQLite on the user's machine) | Universal, B9, B10, B11, C, D | B5 (input validation still applies to local data) | B7 (cloud DB exposure rules), B12, B15 |
| **Desktop app + cloud database/API** (Electron talking to a hosted backend) | Universal, B7, B9, B10, C, D | B2, B3, B4, B5, B6, B13, B14 | B11 (unless it *also* caches data locally) |
| **Mobile app** (native or hybrid) | Universal, B5, B9, C, D | B7 or B11 (whichever DB it uses), B10-equivalent (sandboxing/IPC concepts) | B12 (headers only relevant if it renders web content) |
| **API-only backend / microservice** (no UI) | Universal, B2–B7, B9, B13–B15, C, D | — | B1 (frontend), B10, B11, B12 (unless it serves HTML) |
| **Any project using a cloud/remote database** (MongoDB Atlas, hosted Postgres/MySQL, Firebase, etc.) | B7 in full | — | — |
| **Any project using a local/embedded database** (SQLite, local files, IndexedDB-equivalent) | B11 in full | — | — |
| **Project using both** (e.g. local cache + cloud sync) | B7 **and** B11 both apply | Pay special attention to what's cached locally vs. what's authoritative in the cloud | — |

**Universal row (applies to literally every project type):** Part A (threat
model + never-trust-the-client), B3 (authentication), B4 (authorization), B5
(input validation), B6 (attack defenses relevant to whatever surface exists),
B9 (secrets), B14 (dependency security), all of Part C, all of Part D.

If the project is a mix (e.g. a website with an Electron desktop client
sharing one backend and one cloud database), the AI should apply the union of
every matching row rather than picking just one.

---

## Part 0.6 — Publishing / Release Checklist by Platform

"Publishing" means something different depending on what you're shipping.
The AI should apply the row(s) matching the project, in addition to
everything already selected in Part 0.5.

| Platform | Before you publish, check | Where covered |
|---|---|---|
| **Website** | Production domain/DNS locked down (registrar 2FA, DNSSEC if available), HTTPS/TLS cert valid and auto-renewing, debug/dev settings disabled, hosting/server config reviewed, CDN/WAF settings (if used) | B7, B12, B16, D2 |
| **Desktop app** | Code-signing certificate applied to the build, installer tested on a clean machine, secure updater points at a trusted, HTTPS-verified source, rollback plan for a bad update, uninstaller cleans up properly | B10, C ("Secure Application Updates") |
| **Mobile app (store release)** | App-store signing/provisioning correct, store privacy-label/data-safety form matches what the app actually collects, permissions requested are minimal and justified, deep links validated, crash/monitoring SDK configured before first release | Universal, B5, B9, C |
| **API / backend-only service** | Production environment variables set (not dev defaults), CORS locked to real allowed origins, rate limits active in prod (not just staging), logging/alerting wired to a real destination, rollback plan for a bad deploy | B2, B13, B15, C |
| **Any platform — legal/user-facing** | Privacy Policy, Terms & Conditions, Cookie Policy/Consent (if applicable), copyright/third-party license check, data retention & deletion process defined | B16 |

### Universal "before you click publish" gate (always run, whatever the platform)

- [ ] No passwords or API secrets in the source code or the shipped
      binary/bundle.
- [ ] Encrypted transport working (HTTPS for web/API; TLS for any desktop/
      mobile app talking to a backend).
- [ ] Login and permissions verified end-to-end in the production
      environment, not just locally.
- [ ] Database access (local or cloud) protected per B7/B11.
- [ ] Important user input validated server-side (or in the trusted
      main-process/backend layer).
- [ ] File uploads restricted, if the project has any.
- [ ] Backups exist and have actually been restored once as a test.
- [ ] Legal/privacy pages ready, if the project is user-facing.
- [ ] Security tests from Part C completed.
- [ ] Post-launch monitoring is wired up *before* going live, not added
      afterward.
- [ ] Sign-off recorded (Part D3) with a named reviewer and date.

---

## Part A — Architecture & Mindset

### A1. The Security Lifecycle

Security is not a single feature — it's a continuous process:

```
PLAN → THREAT MODEL → SECURE ARCHITECTURE → SECURE CODING →
AUTHENTICATION + AUTHORIZATION → DATABASE + FILE SECURITY →
SECURITY TESTING → SECURE BUILD / INSTALLER → MONITORING + LOGGING →
BACKUPS + RECOVERY → SECURITY UPDATES → (repeat)
```

### A2. Identify the Assets

Before changing anything, the AI should identify which of these assets exist
in this project and where they live in the code:

- User accounts and passwords
- Personal information
- Business and financial data
- Database records
- Uploaded images and documents
- API keys and other secrets
- Payment information or payment-related tokens
- Application source code and configuration
- Desktop application data and local files
- Administrator accounts

For each asset found, note who/what *should* be allowed to access it.

### A3. Threat Model the Data Flow

**Website:**
```
Browser → Frontend → API/Backend → Database
                            ↓
                       File Storage
                            ↓
                     Third-Party APIs
```

**Desktop app:**
```
User → Desktop UI → Preload/IPC → Main Process
                          ↓
                    Local Database
                          ↓
                     Local Files
                          ↓
                    Internet/API
```

For every component in the actual project, answer:

- What data enters here?
- Can an attacker control that data?
- What permissions does this component have?
- What secrets are stored here?
- Can an attacker bypass the UI and call the backend directly?
- What happens if this component is compromised?

### A4. Core Rule — Never Trust the Client

A browser or desktop UI can always be modified or bypassed. Security
decisions must be enforced in trusted backend or privileged (main-process)
code — never rely on the frontend alone.

- ❌ Bad: Frontend decides "this user is admin, so allow delete."
- ✅ Better: Frontend hides/shows the button for convenience *only*; backend
  checks authentication + role + permission before deleting, every time.

**When implementing:** if the AI finds any delete/edit/admin action gated only
in frontend/renderer code, it must add the equivalent check server-side (or
in the Electron main process) before allowing the action.

---

## Part B — Implementation Checklist

Work through each of these as an implementable task, not just a reading list.

### B1. Website Frontend

- [ ] Use HTTPS for all production traffic.
- [ ] Validate input on the frontend for UX, but always re-validate on the
      server.
- [ ] Never insert untrusted text as raw HTML (avoid `dangerouslySetInnerHTML`
      / `innerHTML` with unsanitized input).
- [ ] Add a Content Security Policy (CSP) appropriate to the app.
- [ ] No private API keys or database credentials in frontend code or bundled
      JS.
- [ ] Don't treat `localStorage`/`sessionStorage` as a secure place for
      highly sensitive secrets.
- [ ] Protect pages/features with backend authorization, not just hidden
      buttons or client-side route guards.

### B2. Backend & API

Treat every incoming request as potentially malicious:

```
REQUEST → HTTPS → Authentication → Authorization → Input Validation →
Business Rules → Database Operation → Safe Response → Security Logging
```

- [ ] Strict request validation with expected data types/schemas.
- [ ] Limit request body sizes.
- [ ] Rate limiting on sensitive endpoints.
- [ ] Safe, generic error messages — never expose stack traces or secrets to
      the client.
- [ ] Object-level permission checks (User A cannot fetch/modify User B's
      records just by changing an ID).
- [ ] Admin APIs protected server-side even if the admin UI is hidden from
      normal users.
- [ ] Secure dependency and package management (lockfile committed, audited).

### B3. Authentication ("Who are you?")

- [ ] Hash passwords with Argon2id or bcrypt — never store plaintext.
- [ ] Secure session management or properly designed access/refresh tokens.
- [ ] HTTPS for login and all authenticated traffic.
- [ ] Protect password reset / account recovery flows (e.g. single-use,
      expiring tokens; don't leak whether an email exists).
- [ ] Add MFA for admin accounts when practical.
- [ ] Rate-limit repeated login attempts.
- [ ] Invalidate/rotate sessions or tokens after sensitive account changes
      (password change, email change, etc.).

### B4. Authorization ("What are you allowed to do?")

```
USER  → Search, View
ADMIN → Search, Add, Edit, Delete, Manage users
```

- [ ] Every sensitive server operation checks permission for the acting user.
- [ ] Every operation also checks access to the *specific record* requested
      (not just the action type).

### B5. Input Validation

Never assume input is safe because it came from your own form.

- [ ] Required fields validated.
- [ ] Type validated (string/number/date/etc.).
- [ ] Length/range validated.
- [ ] Allow-lists used where appropriate (over deny-lists).
- [ ] Unexpected/extra fields rejected when practical.
- [ ] Rich text sanitized if intentionally accepted.
- [ ] All of the above enforced on the backend, even if the frontend already
      validates.

### B6. Common Web Attacks — Defenses to Verify

| Threat | Defensive measures to implement/check |
|---|---|
| SQL injection | Parameterized queries / safe DB APIs; never string-concatenate SQL |
| NoSQL injection | Strict input schemas; avoid unsafe construction of query operators (e.g. reject raw `$` operators from user input) |
| XSS | Output encoding, safe templating, sanitization, CSP |
| CSRF | `SameSite` cookies and CSRF tokens appropriate to the auth design |
| Broken object authorization | Per-object permission checks on every request |
| Brute force | Rate limiting, MFA, strong password hashing, monitoring |
| Malicious file upload | Size limits, real content-type validation, renamed files, safe storage |
| Secret leakage | Environment/secret management; never commit secrets |
| Clickjacking | `frame-ancestors` / related security headers |
| Man-in-the-middle | HTTPS/TLS with correct certificate configuration |
| Vulnerable dependencies | Dependency scanning, updates, lockfiles, review new packages |

### B7. Database Security

- [ ] Database not directly exposed to the public internet unless explicitly
      required and tightly controlled.
- [ ] Web apps go Browser → Backend → Database (never Browser → Database
      directly).
- [ ] Database account uses least-privilege permissions.
- [ ] Database credentials protected (env vars/secrets manager, not source).
- [ ] Encryption in transit, and at rest where appropriate.
- [ ] Regular backups, with restore tests.
- [ ] Transactions used for operations that must stay consistent.
- [ ] Important admin/security-sensitive DB activity logged.

**MERN-style secret handling example:**
```
React → HTTPS → Node.js + Express → Auth/Authz → Validation → MongoDB Atlas

Secrets stay on the backend only:
DATABASE_URI=...
JWT_SECRET=...
OTHER_PRIVATE_KEY=...
```
Never put MongoDB credentials or server-only secrets in React/frontend code.

### B8. File Upload Security

```
UPLOAD → Check authenticated user → Check permission → Check file size →
Check extension → Check MIME type → Validate actual file content →
Generate a safe filename → Store in a safe location → Serve safely
```

- [ ] Don't trust the original filename.
- [ ] Disallow executable file types when not required.
- [ ] Enforce size limits.
- [ ] Consider converting images to a safe, expected format.
- [ ] Never store uploads somewhere they could execute as code.

### B9. Secrets and API Keys

Examples of secrets: database passwords, JWT signing secrets, private API
keys, payment provider secret keys, cloud credentials, private
certificates/signing keys.

- [ ] No secrets hardcoded in source (`const SECRET = "..."` → move to env
      vars / secret manager).
- [ ] `.env` (or equivalent) is git-ignored; only `.env.example` is committed.
- **Desktop-specific:** a secret shipped inside a desktop app can usually be
  extracted by anyone who controls that machine. Keep genuinely private
  operations on a trusted backend, not embedded in the desktop binary.

### B10. Electron / Desktop Application Security

```
Renderer/UI → Preload → Restricted IPC → Main Process →
SQLite / File System / OS APIs
```

- [ ] Context isolation enabled.
- [ ] Node.js integration disabled in the renderer unless required.
- [ ] Only narrow, purpose-built IPC functions exposed via preload — no
      arbitrary shell commands or unrestricted filesystem access.
- [ ] IPC arguments validated in the main process.
- [ ] Electron and dependencies kept up to date.
- [ ] Content loaded from the internet treated as untrusted.
- [ ] Code signing + secure update process for distributed builds.

### B11. Local SQLite / Local Data

- [ ] Database stored in the OS application-data directory, not typically
      inside `Program Files`.
- [ ] Appropriate file permissions.
- [ ] Transactions + parameterized queries.
- [ ] Backups created if the data matters.
- [ ] Encryption considered for sensitive local data.
- [ ] Backup files protected too.
- [ ] Remember: anyone with full control of the PC can potentially inspect
      local app data — plan accordingly.

### B12. Security Headers (Websites)

Review and configure as appropriate to the app:

- [ ] `Content-Security-Policy` (CSP)
- [ ] `Strict-Transport-Security` (HSTS)
- [ ] `X-Content-Type-Options`
- [ ] `Referrer-Policy`
- [ ] `Permissions-Policy`

Don't blindly copy a header config from elsewhere — test it against this
app's actual resources and requirements.

### B13. Rate Limiting & Abuse Protection

- [ ] Stricter limits on login, password reset, registration, upload, and
      other expensive endpoints.
- [ ] Progressive delays or temporary blocks where appropriate.
- [ ] Monitor repeated authorization failures.
- [ ] Pagination and result limits on queries that could be expensive.
- [ ] Upload/request size limits set.

### B14. Dependency Security

```
Your App → Frameworks → Packages → More Packages
```

- [ ] Lockfile (`package-lock.json` or equivalent) committed.
- [ ] Dependency advisories reviewed.
- [ ] Ecosystem audit/scan tooling run (e.g. `npm audit`).
- [ ] Unused packages removed.
- [ ] Dependencies updated regularly, especially for security fixes.
- [ ] Major dependency version bumps reviewed before deploying.

### B15. CORS, Cookies & Cross-Site Protections

- [ ] API only accepts cross-origin requests from trusted origins.
- [ ] Cookies use `SameSite` and appropriate `Secure`/`HttpOnly` flags.
- [ ] CSRF protection in place where cookie-based auth is used.

### B16. Legal, Privacy & Accessibility (Website Publishing)

- [ ] **Privacy Policy** — states what personal data is collected and how
      it's used.
- [ ] **Terms & Conditions** — rules for using the site.
- [ ] **Cookie Policy / Consent** — disclosed and consent captured where the
      law requires it.
- [ ] **Form Consent** — users told what happens to data they submit.
- [ ] **Refund Policy** — present if the site sells anything.
- [ ] **Copyright** — no unlicensed use of others' content.
- [ ] **Third-Party Licenses** — npm packages, fonts, icons, images,
      templates checked for license compatibility.
- [ ] **Accessibility** — key features usable via keyboard and assistive
      tech; meaningful alt text; sufficient color contrast; clear button
      labels (Save/Delete/Cancel/Submit).
- [ ] **No fake reviews** presented as real.
- [ ] **Data retention & deletion** — clear policy on how long data is kept
      and how users can request deletion.
- [ ] **Local laws** applicable to your users/business checked (flag for
      human/legal review — don't assume).

---

## Part C — Testing & Verification

Use multiple layers of testing before release:

- [ ] **Static analysis (SAST)** — scan source for common security mistakes.
- [ ] **Dependency scanning** — find known-vulnerable packages.
- [ ] **Dynamic testing (DAST)** — test the running application.
- [ ] **Manual authorization testing** — try accessing resources as different
      roles/users.
- [ ] **Input testing** — send unexpected, malformed, oversized values.
- [ ] **File-upload testing** — test type, size, filename, content
      restrictions.
- [ ] **Configuration review** — production settings, headers, HTTPS, CORS,
      secrets.
- [ ] **Desktop testing** — IPC exposure, filesystem access, update
      behavior, installer permissions.

### Logging & Monitoring

Log:
- Failed and successful logins
- Password reset events
- Administrative actions
- Authorization failures
- Suspicious request patterns
- Important file-upload events
- Application errors and crashes
- Security-relevant configuration changes

**Never log:** passwords, private keys, session secrets, or other sensitive
data unnecessarily.

### Backup & Disaster Recovery

```
Database → Automatic/scheduled backup → Protected backup storage →
Periodic restore test → Recovery plan
```

- [ ] Backup frequency decided.
- [ ] Backups protected from unauthorized access.
- [ ] More than one recovery copy where appropriate.
- [ ] Restoration actually tested, not assumed to work.
- [ ] Documented plan for what to do if the primary database is lost or
      corrupted.

### Secure Application Updates (Desktop)

```
Installed App → Check trusted update source → Find newer version →
Verify authenticity/signature → Download → Install → Restart
```

- [ ] Signed releases where supported.
- [ ] Trusted update distribution mechanism.
- [ ] Never blindly execute arbitrary downloaded files.
- [ ] Updates tested before release.
- [ ] Rollback/recovery plan for failed updates.

### Incident Response Plan

If a compromise is suspected:

1. Identify what happened.
2. Contain the affected account, server, application, or endpoint.
3. Preserve relevant logs and evidence.
4. Rotate compromised credentials and secrets.
5. Fix the vulnerability.
6. Restore affected systems or data if necessary.
7. Deploy the security fix.
8. Monitor for continued suspicious activity.
9. Review the incident and improve the system.

---

## Part D — Status Checklists (fill these in as a report)

### D1. Beginner Security Checklist

- [ ] HTTPS enabled for production web traffic.
- [ ] Passwords hashed with a password-hashing algorithm.
- [ ] No passwords or private API keys in frontend code.
- [ ] Backend validates every important input.
- [ ] Backend checks authorization for sensitive operations.
- [ ] Users cannot access other users' records without permission.
- [ ] Admin functions protected server-side.
- [ ] File uploads have size/type/content restrictions.
- [ ] Database credentials protected.
- [ ] Database not unnecessarily exposed to the public internet.
- [ ] Rate limiting exists on sensitive endpoints.
- [ ] Security headers reviewed.
- [ ] Dependencies scanned and updated.
- [ ] Error messages don't expose secrets or stack traces.
- [ ] Security-relevant events logged.
- [ ] Backups exist and restoration has been tested.
- [ ] Desktop Electron renderer isolated from privileged Node APIs.
- [ ] IPC functions are narrow and validate their arguments.
- [ ] Desktop releases signed where practical.
- [ ] Application updates come from a trusted source.
- [ ] A response plan exists for compromised credentials or data.

### D2. Before You Click "Publish"

- [ ] No passwords or API secrets in the source code.
- [ ] HTTPS is working.
- [ ] Login and permissions work correctly.
- [ ] Database access is protected.
- [ ] Important user input is validated.
- [ ] File uploads restricted (if applicable).
- [ ] Backups available and tested.
- [ ] Privacy Policy and Terms ready (if applicable).
- [ ] Copyright and licenses checked.
- [ ] Important security tests finished.
- [ ] You know what to do if a security problem happens.

### D3. Final Release Sign-Off

| Field | Value |
|---|---|
| Project / Website Name | |
| Production Domain | |
| Reviewed By | |
| Date | |
| Release Status | ☐ Ready to Publish  ☐ Needs Fixes |

---

## Reference — Workflow Templates

**Secure MERN development workflow:**
```
1. Requirements       8. API security          15. Security review
2. Threat model        9. MongoDB security      16. Production configuration
3. React UI            10. File security        17. HTTPS
4. Express/Node backend 11. Security headers     18. Deploy
5. Authentication      12. Rate limiting        19. Monitor
6. Authorization       13. Dependency scanning  20. Backup
7. Input validation    14. Automated tests      21. Patch and update
```

**Secure Electron + SQLite workflow:**
```
1. Requirements        7. SQLite schema          13. Electron security review
2. Threat model         8. Safe database queries 14. Build installer
3. UI                   9. File permissions      15. Code signing
4. Preload security    10. Local backup          16. Secure updater
5. Restricted IPC      11. Sensitive-data prot.  17. Crash/error monitoring
6. Main-process valid. 12. Dependency scanning   18. Security updates
```

**Final architecture to remember:**
```
INTERNET
   │  HTTPS
┌──▼────────┐
│ FRONTEND  │
└──┬────────┘
   │ Authentication → Authorization → Input Validation → Rate Limiting
┌──▼────────┐
│ BACKEND   │
└──┬────────┘
   │
┌──┴──────┬─────────┐
▼         ▼         ▼
Database Storage   APIs
   │
Backups → Monitoring/Logs

DESKTOP:
UI → Preload → Restricted IPC → Main Process → SQLite/Files
   → Secure Updates → Code Signing
```

## The 10 Rules (quick reference)

1. Never trust client-side security alone.
2. Validate all important input on the server or trusted process.
3. Authenticate users securely.
4. Authorize every sensitive action and resource.
5. Keep secrets out of frontend and renderer code.
6. Use least privilege for databases, APIs, files, and processes.
7. Protect file uploads and local files.
8. Scan dependencies and test security before release.
9. Monitor, back up, and test recovery.
10. Patch and securely update applications continuously.

---

*This playbook is practical guidance, not a guarantee of complete security or
legal compliance. Requirements vary by country, business, and the type of
data your application handles. For regulated or sensitive projects, get
professional security and legal advice.*
