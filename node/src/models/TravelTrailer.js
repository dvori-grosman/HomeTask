import mongoose from 'mongoose';

const travelTrailerSchema = new mongoose.Schema(
  {
    trailerId: { type: String, required: true, unique: true },
    available_from: { type: Date, required: true },
    location: {
      type: {
        type: String, // 'Point' כדי לציין שמדובר בנקודה גיאוגרפית
        enum: ['Point'], // רק 'Point' מותר
        required: true
      },
      coordinates: {
        type: [Number], // מערך של מספרים עבור קואורדינטות [longitude, latitude]
        required: true
      }
    }
  },
  { timestamps: true }
);


travelTrailerSchema.index({ location: '2dsphere' });

export default mongoose.model('TravelTrailer', travelTrailerSchema);
