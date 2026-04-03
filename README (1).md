# 🔐 Secure User Management System
### DevelopersHub Cybersecurity Internship Project

A Node.js/Express web application demonstrating real-world security practices — built as part of a 3-week cybersecurity internship at DevelopersHub Corporation.

---

## 📋 Project Overview

This project involves securing a User Management System by identifying common web vulnerabilities and applying industry-standard fixes. It covers **security assessment**, **implementation of security measures**, and **basic penetration testing**.

---

## ✅ Features Implemented

| Feature | Library | Week |
|---|---|---|
| Secure HTTP Headers | `helmet` | Week 2 |
| Input Validation & Sanitization | `validator` | Week 2 |
| Password Hashing (bcrypt, salt=10) | `bcrypt` | Week 2 |
| Token-Based Authentication | `jsonwebtoken` | Week 2 |
| Security & Access Logging | `winston` | Week 3 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/secure-user-management.git
cd secure-user-management
npm install
npm start
```

The app runs at `http://localhost:3000`

---

## 📡 API Endpoints

### POST `/signup`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{ "message": "Account created successfully. Please log in." }
```

---

### POST `/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

### GET `/profile`
Access profile (protected — requires JWT).

**Header:**
```
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "id": "1234567890",
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

## 🛡️ Security Measures Applied

### 1. Input Validation (Week 2)
All user inputs are validated using the `validator` library before processing.

```js
if (!validator.isEmail(email)) {
  return res.status(400).json({ error: 'Invalid email address.' });
}
```

### 2. Password Hashing (Week 2)
Passwords are never stored in plain text. Hashed using `bcrypt` with salt rounds of 10.

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

### 3. JWT Authentication (Week 2)
Protected routes require a valid signed JWT token.

```js
const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
```

### 4. HTTP Security Headers (Week 2)
`helmet` automatically sets secure headers (X-Frame-Options, CSP, HSTS, etc.)

```js
app.use(helmet());
```

### 5. Security Logging (Week 3)
All login attempts, access events, and suspicious activity are logged via `winston`.

---

## 🔍 Vulnerabilities Identified (Week 1)

| # | Vulnerability | Type | Status |
|---|---|---|---|
| 1 | Unsanitized user inputs | XSS | ✅ Fixed |
| 2 | Plain-text password storage | Weak Auth | ✅ Fixed |
| 3 | No authentication on routes | Auth Bypass | ✅ Fixed |
| 4 | Missing HTTP security headers | Misconfiguration | ✅ Fixed |
| 5 | SQL Injection in login (test) | Injection | ✅ Fixed |

---

## 📁 Project Structure

```
secure-user-management/
├── server.js         # Main application with all security measures
├── security.log      # Auto-generated security log
├── package.json
└── README.md
```

---

## 🔒 Security Best Practices Checklist

- [x] Validate and sanitize all user inputs
- [x] Hash and salt all passwords before storing
- [x] Use HTTPS for data transmission (use SSL in production)
- [x] Implement token-based authentication (JWT)
- [x] Set secure HTTP headers with helmet
- [x] Log all authentication and access events
- [x] Never expose password hashes in API responses
- [x] Use generic error messages to prevent user enumeration

---

## 📦 Dependencies

```json
{
  "bcrypt": "^5.x",
  "express": "^4.x",
  "helmet": "^7.x",
  "jsonwebtoken": "^9.x",
  "validator": "^13.x",
  "winston": "^3.x"
}
```

---

## 👨‍💻 Author

**Faiza Anjum**
Cybersecurity Intern — DevelopersHub Corporation
