import Order, { ENUMS } from '../models/Order.js';
import TravelTrailer from '../models/TravelTrailer.js';
import { calcPriceNis, calcTimeEstimateMinutes } from '../utils/price.js';
import { ensureDate } from '../utils/time.js';
import geolib from 'geolib'

// GET /api/orders (admin only)
export async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.find().populate('trailerAssigned').sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    next(e);
  }
}
// GET /api/orders/:orderNumber  (public)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders (public)
; // יש לוודא שהספרייה מותקנת

export async function addOrder(req, res, next) {
  try {
    const {
      customerName,
      phone,
      carNumber,
      carType,
      serviceType,
      requestedAt,
      address,
      lat,
      lng,
      dirtLevel,
      distanceKm = 0
    } = req.body;

    // basic validations
    if (!customerName || !phone || !carNumber || !carType || !serviceType || !requestedAt || !dirtLevel) {
      return res.status(400).json({ message: 'שדות חובה חסרים' });
    }
    if (!ENUMS.CAR_TYPES.includes(carType)) return res.status(400).json({ message: 'carType לא חוקי' });
    if (!ENUMS.SERVICE_TYPES.includes(serviceType)) return res.status(400).json({ message: 'serviceType לא חוקי' });

    const reqDate = ensureDate(requestedAt);

    // --- בחירת ניידת ---
    const trailers = await TravelTrailer.find().sort({ available_from: 1 });

    if (!trailers.length) {
      return res.status(409).json({ message: 'אין ניידות רשומות במערכת' });
    }

    // מוצאים ניידת פנויה <= זמן מבוקש
    let trailerAssigned = trailers.find(t => t.available_from <= reqDate);

    if (!trailerAssigned) {
      trailerAssigned = trailers[trailers.length - 1];
    }

    // חישוב המרחק בין הניידת ללקוח
    const trailerLocation = trailerAssigned.location.coordinates; // [longitude, latitude]
    const customerLocation = [lng, lat]; // [longitude, latitude]
    
    const distance = geolib.getDistance(
      { latitude: trailerLocation[1], longitude: trailerLocation[0] },
      { latitude: customerLocation[1], longitude: customerLocation[0] }
    );

    // המרחק בקילומטרים
    const distanceKmCalculated = distance / 1000;

    // חישוב המחיר לפי המרחק
    const priceNis = 50 + (20 * dirtLevel) + (2 * distanceKmCalculated);

    // חישוב זמן
    const baseTime = 30; // דק' בסיס
    const dirtTime = 10 * dirtLevel; // דק' לפי רמת לכלוך
    const additionalTime = (serviceType === 'פוליש' ? 15 : 0) + (serviceType === 'ווקס' ? 10 : 0);
    const timeEstimateMin = baseTime + dirtTime + additionalTime;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const order = await Order.create({
      customerName,
      phone,
      carNumber,
      carType,
      serviceType,
      requestedAt: reqDate,
      location: { address, lat, lng },
      imageUrl,
      dirtLevel,
      orderNumber: `SCW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'ממתין',
      distanceKm: distanceKmCalculated,
      timeEstimateMin: timeEstimateMin,
      priceNis: priceNis,
      trailerAssigned: trailerAssigned._id
    });

    res.status(201).json(await order.populate('trailerAssigned'));
  } catch (e) {
    next(e);
  }
}



// PUT /api/orders/:id (admin only)
export async function editOrder(req, res, next) {
  try {
    const orderNumber = req.params.orderNumber;
    const allowed = [
      'customerName',
      'phone',
      'carNumber',
      'carType',
      'serviceType',
      'requestedAt',
      'location',
      'dirtLevel',
      'status',
      'distanceKm'
    ];

    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    if (updates.requestedAt) updates.requestedAt = ensureDate(updates.requestedAt);

    // השג את ההזמנה הקיימת לפי orderNumber
    const existingOrder = await Order.findOne({ orderNumber });
    if (!existingOrder) return res.status(404).json({ message: 'Order not found' });

    // 🔹 אם הסטטוס השתנה – הוספת לוג חדש
    if (updates.status && updates.status !== existingOrder.status) {
      existingOrder.statusLogs.push({ status: updates.status });
    }

    // חישוב מחדש אם צריך
    const recompute =
      updates.dirtLevel !== undefined ||
      updates.distanceKm !== undefined ||
      updates.serviceType !== undefined;

    if (recompute) {
      const dirt = updates.dirtLevel ?? existingOrder.dirtLevel;
      const dist = updates.distanceKm ?? existingOrder.distanceKm;
      const svc = updates.serviceType ?? existingOrder.serviceType;
      updates.timeEstimateMin = calcTimeEstimateMinutes(svc, dirt);
      updates.priceNis = calcPriceNis(dirt, dist);
    }

    // אם תאריך הבקשה השתנה – חיפוש ניידת חדשה
    if (updates.requestedAt) {
      const trailer = await TravelTrailer.find({
        available_from: { $gte: updates.requestedAt }
      })
        .sort({ available_from: 1 })
        .limit(1);

      if (!trailer.length)
        return res.status(409).json({ message: 'אין ניידת זמינה בזמן החדש' });

      updates.trailerAssigned = trailer[0]._id;
    }

    // עדכון השדות ושמירה
    Object.assign(existingOrder, updates);
    await existingOrder.save();

    await existingOrder.populate('trailerAssigned');
    res.json(existingOrder);
  } catch (e) {
    next(e);
  }
}


//
