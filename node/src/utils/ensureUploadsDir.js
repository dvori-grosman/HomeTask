import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the uploads directory
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

// Function to ensure the uploads directory exists
export function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Creating uploads directory at: ${uploadsDir}`);
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created successfully');
    } catch (error) {
      console.error('❌ Error creating uploads directory:', error);
      throw error;
    }
  } else {
    console.log('✅ Uploads directory already exists');
  }
}

// Export the uploads directory path
export const UPLOADS_DIR = uploadsDir;
