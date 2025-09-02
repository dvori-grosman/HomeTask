import mongoose from 'mongoose';

const CAR_TYPES = ['פרטי', 'מסחרי', 'ג׳יפ', 'וואן'];
const SERVICE_TYPES = ['חוץ', 'חוץ+פנים', 'פוליש', 'ווקס'];
const STATUS_TYPES = ['ממתין', 'בדרך', 'שטיפה', 'הושלם'];

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    carNumber: { type: String, required: true },
    carType: { type: String, enum: CAR_TYPES, required: true },
    serviceType: { type: String, enum: SERVICE_TYPES, required: true },
    requestedAt: { type: Date, required: true },
    location: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number }
    },
    imageUrl: { type: String },
    dirtLevel: { type: Number, min: 1, max: 5, required: true },
    orderNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: STATUS_TYPES, default: 'ממתין' },
    distanceKm: { type: Number, default: 0 },
    timeEstimateMin: { type: Number, required: true },
    priceNis: { type: Number, required: true },
    trailerAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelTrailer',
      required: true
    }
  },
  { timestamps: true }
);

export const ENUMS = { CAR_TYPES, SERVICE_TYPES, STATUS_TYPES };
export default mongoose.model('Order', orderSchema);