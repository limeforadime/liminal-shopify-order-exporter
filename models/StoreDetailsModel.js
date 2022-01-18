/**
 * Model to store transactional IDs irrespective of current store status.
 */
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { profileSchema } from './ProfileModel';

const StoreDetailsSchema = new Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    profiles: [profileSchema],
  },
  { timestamps: true }
);

const StoreDetailsModel = mongoose.model('store-detail', StoreDetailsSchema);

export default StoreDetailsModel;
