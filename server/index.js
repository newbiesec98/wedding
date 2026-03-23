import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db/index.js';
import { guests, config, galleries, loveStories, digitalGifts } from './db/schema.js';
import { eq, asc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-wedding-key';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(uploadDir));

// === AUTH MIDDLEWARE ===
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// === AUTH API ===
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// === UPLOAD API ===
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// === GUESTS API ===
app.get('/api/guests', async (req, res) => {
  try {
    const allGuests = await db.select().from(guests);
    res.json(allGuests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/guests', async (req, res) => {
  try {
    const { name, status, guestsCount, message, timestamp } = req.body;
    const newGuest = await db.insert(guests).values({
      name,
      status: status || null,
      guestsCount: guestsCount || 0,
      message: message || '',
      timestamp: timestamp || new Date().toISOString()
    }).returning();
    res.json(newGuest[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, guestsCount, message } = req.body;
    const updated = await db.update(guests)
      .set({ name, status, guestsCount, message })
      .where(eq(guests.id, Number(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/guests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(guests).where(eq(guests.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === CONFIG API ===
app.get('/api/config', async (req, res) => {
  try {
    const allConfig = await db.select().from(config);
    const configObj = {};
    for (const item of allConfig) {
      configObj[item.key] = item.value;
    }
    res.json(configObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', authenticateToken, async (req, res) => {
  try {
    const newConfig = req.body;
    for (const [key, value] of Object.entries(newConfig)) {
      const existing = await db.select().from(config).where(eq(config.key, key));
      if (existing.length > 0) {
        await db.update(config).set({ value: String(value) }).where(eq(config.key, key));
      } else {
        await db.insert(config).values({ key, value: String(value) });
      }
    }
    res.json({ success: true, config: newConfig });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === GALLERIES API ===
app.get('/api/galleries', async (req, res) => {
  try {
    const list = await db.select().from(galleries).orderBy(asc(galleries.orderIndex));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/galleries', authenticateToken, async (req, res) => {
  try {
    const { imageUrl, caption, orderIndex } = req.body;
    const item = await db.insert(galleries).values({
      imageUrl, caption, orderIndex: orderIndex || 0
    }).returning();
    res.json(item[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/galleries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, caption, orderIndex } = req.body;
    const updated = await db.update(galleries)
      .set({ imageUrl, caption, orderIndex: orderIndex || 0 })
      .where(eq(galleries.id, Number(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/galleries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(galleries).where(eq(galleries.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === LOVE STORIES API ===
app.get('/api/love_stories', async (req, res) => {
  try {
    const list = await db.select().from(loveStories).orderBy(asc(loveStories.orderIndex));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/love_stories', authenticateToken, async (req, res) => {
  try {
    const { date, title, description, imageUrl, orderIndex } = req.body;
    const item = await db.insert(loveStories).values({
      date, title, description, imageUrl, orderIndex: orderIndex || 0
    }).returning();
    res.json(item[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/love_stories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, title, description, imageUrl, orderIndex } = req.body;
    const updated = await db.update(loveStories)
      .set({ date, title, description, imageUrl, orderIndex: orderIndex || 0 })
      .where(eq(loveStories.id, Number(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/love_stories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(loveStories).where(eq(loveStories.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === DIGITAL GIFTS API ===
app.get('/api/digital_gifts', async (req, res) => {
  try {
    const list = await db.select().from(digitalGifts);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/digital_gifts', authenticateToken, async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, qrCodeUrl } = req.body;
    const item = await db.insert(digitalGifts).values({
      bankName, accountNumber, accountHolder, qrCodeUrl
    }).returning();
    res.json(item[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/digital_gifts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { bankName, accountNumber, accountHolder, qrCodeUrl } = req.body;
    const updated = await db.update(digitalGifts)
      .set({ bankName, accountNumber, accountHolder, qrCodeUrl })
      .where(eq(digitalGifts.id, Number(id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/digital_gifts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(digitalGifts).where(eq(digitalGifts.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express Backend running on http://localhost:${PORT}`);
});
