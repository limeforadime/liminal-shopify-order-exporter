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
    global: {},
    selectedTags: {
      type: [String],
      required: true,
    },
    fields: {
      checkedMainState: {
        type: Object,
        required: true,
      },
      checkedCustomerState: {
        type: Object,
        required: true,
      },
      checkedLineItemsState: {
        type: Object,
        required: true,
      },
      checkedTransactionsState: {
        type: Object,
        required: true,
      },
      checkedBillingAddressState: {
        type: Object,
        required: true,
      },
      checkedDiscountCodesState: {
        type: Object,
        required: true,
      },
      checkedShippingAddressState: {
        type: Object,
        required: true,
      },
      checkedShippingLinesState: {
        type: Object,
        required: true,
      },
      checkedTaxLinesState: {
        type: Object,
        required: true,
      },
      checkedFulfillmentsState: {
        type: Object,
        required: true,
      },
      checkedFulfillmentOrdersState: {
        type: Object,
        required: true,
      },
    },
  },
});

const ProfileModel = mongoose.model('Profile', profileSchema);

export { profileSchema };
export default ProfileModel;
