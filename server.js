// ============================================================
//  Secure User Management System
//  DevelopersHub Cybersecurity Internship - Week 1, 2 & 3
// ============================================================

const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const helmet  = require('helmet');
const validator = require('validator');
const winston = require('winston');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'dev-secret-key-change-in-production';

// ─── Logger (Week 3: Basic Logging with Winston) ────────────
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'security.log' })
  ]
});

logger.info('Application starting up...');

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet());                    // Week 2: Secure HTTP headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory "database" (mock)
const users = [];

// ─── Authentication Middleware ───────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    logger.warn(`Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(`Invalid token used for ${req.path}`);
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// ─── Routes ──────────────────────────────────────────────────

// Home
app.get('/', (req, res) => {
  logger.info('Home page accessed');
  res.json({ message: 'Secure User Management System', status: 'running' });
});

// SIGNUP  (Week 2: Input Validation + Password Hashing)
app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  // --- Input Validation (validator library) ---
  if (!username || validator.isEmpty(username.trim())) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  if (!email || !validator.isEmail(email)) {
    logger.warn(`Signup attempt with invalid email: ${email}`);
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!password || !validator.isLength(password, { min: 8 })) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  // Check if user already exists
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // --- Password Hashing with bcrypt (saltRounds = 10) ---
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    username: validator.escape(username.trim()),
    email: validator.normalizeEmail(email),
    password: hashedPassword   // never store plain text!
  };

  users.push(newUser);
  logger.info(`New user registered: ${newUser.email}`);

  res.status(201).json({ message: 'Account created successfully. Please log in.' });
});

// LOGIN  (Week 2: JWT Token-Based Authentication)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find(u => u.email === validator.normalizeEmail(email));
  if (!user) {
    logger.warn(`Failed login attempt for: ${email}`);
    return res.status(401).json({ error: 'Invalid credentials.' }); // generic message for security
  }

  // Compare hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    logger.warn(`Wrong password for: ${email}`);
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // Issue JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  logger.info(`Successful login: ${user.email}`);
  res.json({ message: 'Login successful.', token });
});

// PROFILE  (protected route — requires valid JWT)
app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  logger.info(`Profile accessed by: ${user.email}`);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email
    // password is NEVER returned
  });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  console.log(`\n✅ Server started on http://localhost:${PORT}`);
  console.log(`   Try: POST /signup  |  POST /login  |  GET /profile\n`);
});
