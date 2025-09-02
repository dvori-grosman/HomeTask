// src/seed/createAdmin.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// נזהה את מיקום הקובץ כדי לטעון .env מהשורש
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// --- עכשיו נטען את שאר הספריות ---
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import '../config/db.js';

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const mongoUri = "mongodb://localhost:27017/Smart-Wash-Car";

  if (!mongoUri) {
    console.error('❌ MONGO_URI is missing in .env'+ mongoUri);
    process.exit(1);
  }
  console.log('📌 Using MONGO_URI:', mongoUri);

  if (!email || !password) {
    console.error('❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log('ℹ️ Admin already exists');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });
  console.log(`✅ Admin ${email} created`);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
