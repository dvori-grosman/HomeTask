import mongoose from 'mongoose';

const uri = "mongodb://localhost:27017/Smart-Wash-Car";
if (!uri) {
  console.error('❌ MONGO_URI is missing in .env');
  process.exit(1);
}

mongoose
  .connect(uri, { autoIndex: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error', err);
    process.exit(1);
  });