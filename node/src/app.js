import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/db.js';

import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import travelTrailerRoutes from './routes/travelTrailerRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// static for uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'Smart Car Wash Pro 2.0' });
});

// הגדרת תיקיית ה-build
app.use(express.static(path.join(__dirname, 'build')));

// כל בקשה לאפליקציה תופנה ל-index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api/admin', adminRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/trailers', travelTrailerRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;
