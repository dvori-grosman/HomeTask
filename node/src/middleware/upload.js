import multer from 'multer';
import path from 'path';
import { UPLOADS_DIR } from '../utils/ensureUploadsDir.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

export const upload = multer({ storage });
