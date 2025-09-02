import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model('Admin', adminSchema);