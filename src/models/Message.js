import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
    default: 'ai',
  },
});

export default mongoose.model('Message', messageSchema);
