import mongoose from 'mongoose';

const protfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  skills: { type: String },
  projects: { type: String },
  github: { type: String },
}, {
  timestamps: true,
});

export default mongoose.model('Profile', protfolioSchema);


