import mongoose from 'mongoose';

// Railway מספק MONGO_URL אוטומטית כשאתה מוסיף MongoDB service
// נסה גם DATABASE_URL כגיבוי (לפעמים Railway משתמש בזה)
const uri = process.env.MONGO_URL || 
           process.env.DATABASE_URL || 
           "mongodb://localhost:27017/Smart-Wash-Car";

if (!uri) {
  console.error('❌ MONGO_URI is missing - check Railway environment variables');
  process.exit(1);
}

// הצגת סוג הסביבה (בלי חשיפת הסיסמה)
const isLocal = uri.includes('localhost');
console.log(`🌐 Connecting to ${isLocal ? 'Local' : 'Railway'} MongoDB...`);

mongoose
  .connect(uri, { 
    autoIndex: true,
    // הגדרות נוספות לפרודקשן
    serverSelectionTimeoutMS: 5000, // timeout אחרי 5 שניות
    socketTimeoutMS: 45000, // timeout לחיבור
    maxPoolSize: 10 // מגבלת חיבורים מקסימלית
  })
  .then(() => {
    console.log(`✅ MongoDB connected successfully`);
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    
    // הוספת מידע לדיבוג
    if (err.code === 'ENOTFOUND') {
      console.error('💡 Check if MONGO_URL environment variable is set correctly');
    }
    
    process.exit(1);
  });

// טיפול בסגירת חיבור נקייה
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed cleanly');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error closing MongoDB connection:', err);
    process.exit(1);
  }
});