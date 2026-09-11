# Bug Identification Report - Task Management Application

The following are potential bugs and risk areas identified through code review and static analysis of the application (without executing it).

---

## Bug #1: No Password Confirmation Validation on Server Side

- **Severity**: Major
- **Description**: The registration API endpoint (`POST /api/auth/register`) does not validate whether the password and confirm password fields match. The confirm password validation only happens on the client side (in `auth.js`). If someone sends a direct API request (via curl or Postman), they can bypass this check entirely.
- **Reason/Impact**: A user could accidentally register with a mistyped password if the frontend validation is bypassed. They would then be unable to login since they don't know the actual password that was stored.

---

## Bug #2: No Email Format Validation on Server Side

- **Severity**: Major
- **Description**: The `/api/auth/register` and `/api/auth/login` endpoints do not validate the email format on the server side. The email field in the Mongoose model only checks for `required` and applies `lowercase`, but does not validate the format using a regex pattern.
- **Reason/Impact**: Invalid email strings like "notanemail" or "@@.." could be stored in the database, causing data integrity issues and potentially breaking email-related features if added later.

---

## Bug #3: No Rate Limiting on Login/Register Endpoints

- **Severity**: Critical
- **Description**: There is no rate limiting or brute-force protection on the `/api/auth/login` and `/api/auth/register` endpoints. An attacker could attempt unlimited login requests to guess passwords.
- **Reason/Impact**: This makes the application vulnerable to brute-force attacks. An attacker can automate password guessing with tools like Hydra or Burp Suite, potentially compromising user accounts.

---

## Bug #4: Task Title Allows Whitespace-Only Input from API

- **Severity**: Minor
- **Description**: While the task creation route trims the title and checks for empty string, if someone sends a title with only special whitespace characters (like `\t` or `\n`), these may pass the trim check on some edge cases. The frontend doesn't prevent this either — the HTML `required` attribute only checks for completely empty fields.
- **Reason/Impact**: Tasks with effectively empty/blank titles could appear in the task list, causing confusion and poor UX.

---

## Bug #5: No CSRF Protection

- **Severity**: Critical
- **Description**: The application uses session-based authentication but does not implement CSRF (Cross-Site Request Forgery) protection tokens. Any authenticated user who visits a malicious website could have requests forged on their behalf.
- **Reason/Impact**: An attacker could create a malicious page that sends POST requests to the task API (create, delete, update tasks) or even logout the user, all without the user's knowledge or consent.

---

## Bug #6: Error Messages Reveal Whether Email Exists

- **Severity**: Minor
- **Description**: The registration endpoint returns "Email already registered" when a duplicate email is used. While the login endpoint correctly returns a generic "Invalid email or password" message, the register endpoint leaks information about which emails are registered in the system.
- **Reason/Impact**: An attacker can use the registration endpoint to enumerate valid email addresses in the system, which can then be used for targeted phishing or brute-force attacks on those specific accounts.

---

## Bug #7: Session Not Invalidated on Password Change

- **Severity**: Major
- **Description**: There is no password change/reset functionality implemented, but if added in the future, the current session management does not have a mechanism to invalidate all existing sessions when a password changes. The session store (MongoStore) will keep old sessions active.
- **Reason/Impact**: If a user's account is compromised and they change their password, the attacker's existing session would remain active, meaning the password change doesn't actually secure the account.

---

## Bug #8: MongoDB Injection Risk in Task Routes

- **Severity**: Major
- **Description**: The task routes use `req.params.id` directly in MongoDB queries (`Task.findOne({ _id: req.params.id })`). If an invalid or specially crafted ObjectId is passed, Mongoose will throw a CastError that is caught by the generic catch block, but the error handling returns a generic "Server error" instead of a meaningful "Invalid task ID" message.
- **Reason/Impact**: While Mongoose provides some protection against NoSQL injection, the lack of input validation on the `id` parameter means the server returns 500 errors instead of proper 400 errors for malformed IDs. This makes debugging harder and can confuse API consumers.

---

## Bug #9: No Input Length Limits on Task Fields

- **Severity**: Minor
- **Description**: The Task model does not enforce any maximum length on the `title` or `description` fields. A user could submit extremely long strings (megabytes of text) which would be stored in MongoDB without any limits.
- **Reason/Impact**: This could lead to database storage bloat, slow query performance, and potential DoS (Denial of Service) if an attacker sends very large payloads repeatedly. It could also break the frontend table layout if extremely long text is displayed.

---

## Bug #10: Session Secret Hardcoded in Fallback

- **Severity**: Major
- **Description**: In `server.js`, the session configuration uses a fallback secret: `process.env.SESSION_SECRET || 'fallback_secret'`. If the `.env` file is not properly configured, the application will run with a weak, predictable session secret.
- **Reason/Impact**: A predictable session secret allows an attacker to forge session cookies, potentially impersonating any user in the system. This is a significant security vulnerability in a production environment.
