/**
 * Encrypted Mongo Model to persist sessions across restarts.
 */

import mongoose from 'mongoose';
const { Schema } = mongoose;

// https://github.com/Shopify/shopify-node-api/issues/224#issuecomment-888579421
// "store session token", lasts 24hrs
// "user session token", lasts 60 seconds so set it to expire 60 seconds from now
const sessionSchema = new Schema({
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
