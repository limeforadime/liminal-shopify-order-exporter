/*
  Export Profile model which contains saved settings (tags, checkboxes, etc.)
*/
import mongoose from 'mongoose';
const { Schema } = mongoose;

const profileSchema = new Schema({
  ownerShop: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  settings: {
    global: {}, // will get to last
    selectedTags: {
      type: Array,
      required: true,
    },
    fields: {
      checkedMainState: {
        type: Array,
        required: true,
      },
      checkedCustomerState: {
        type: Array,
        required: true,
      },
      checkedLineItemsState: {
        type: Array,
        required: true,
      },
      checkedTransactionsState: {
        type: Array,
        required: true,
      },
      checkedBillingAddressState: {
        type: Array,
        required: true,
      },
      checkedDiscountCodesState: {
        type: Array,
        required: true,
      },
      checkedShippingAddressState: {
        type: Array,
        required: true,
      },
      checkedShippingLinesState: {
        type: Array,
        required: true,
      },
      checkedTaxLinesState: {
        type: Array,
        required: true,
      },
      checkedFulfillmentState: {
        type: Array,
        required: true,
      },
    },
  },
});

const ProfileModel = mongoose.model('Profile', profileSchema);

export { profileSchema };
export default ProfileModel;
