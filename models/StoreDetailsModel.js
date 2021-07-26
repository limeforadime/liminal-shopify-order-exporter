/**
 * Model to store transactional IDs irrespective of current store status.
 */
import mongoose from 'mongoose';

const StoreDetailsSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StoreDetailsModel = mongoose.model('store-detail', StoreDetailsSchema);

export default StoreDetailsModel;
