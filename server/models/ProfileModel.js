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
      type: [String],
      required: true,
    },
    fields: {
      checkedMainState: {
        type: [Boolean],
        required: true,
      },
      checkedCustomerState: {
        type: [Boolean],
        required: true,
      },
      checkedLineItemsState: {
        type: [Boolean],
        required: true,
      },
      checkedTransactionsState: {
        type: [Boolean],
        required: true,
      },
      checkedBillingAddressState: {
        type: [Boolean],
        required: true,
      },
      checkedDiscountCodesState: {
        type: [Boolean],
        required: true,
      },
      checkedShippingAddressState: {
        type: [Boolean],
        required: true,
      },
      checkedShippingLinesState: {
        type: [Boolean],
        required: true,
      },
      checkedTaxLinesState: {
        type: [Boolean],
        required: true,
      },
      checkedFulfillmentState: {
        type: [Boolean],
        required: true,
      },
    },
  },
});

const ProfileModel = mongoose.model('Profile', profileSchema);

export { profileSchema };
export default ProfileModel;
