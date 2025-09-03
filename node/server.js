import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './src/app.js';

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

