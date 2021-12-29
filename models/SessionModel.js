/**
 * Encrypted Mongo Model to persist sessions across restarts.
 */

import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '24h',
    default: Date.now,
  },
});

const SessionModel = mongoose.model('Session', sessionSchema);

export default SessionModel;
