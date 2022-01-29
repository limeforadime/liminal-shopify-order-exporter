/**
 * Model to store transactional IDs irrespective of current store status.
 */
import mongoose from 'mongoose';
const { Schema } = mongoose;
import MappingModel, { mappingSchema } from './MappingModel';

const shopSchema = new Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    mappings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Mapping',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

shopSchema.methods.addNewMapping = async function (mappingName) {
  const newMapping = await MappingModel.create({
    ownerShop: this.shop,
    name: mappingName,
    settings: {
      global: {},
      selectedTags: [],
      fields: {
        checkedMainState: [],
        checkedCustomerState: [],
        checkedLineItemsState: [],
        checkedTransactionsState: [],
        checkedBillingAddressState: [],
        checkedDiscountCodesState: [],
        checkedShippingAddressState: [],
        checkedShippingLinesState: [],
        checkedTaxLinesState: [],
        checkedFulfillmentState: [],
      },
    },
  });
  const updatedMappings = [...this.mappings];
  updatedMappings.push(newMapping);
  this.mappings = updatedMappings;
  await this.save();
};

// Statics
shopSchema.statics.createOrUpdateShop = async function (shop) {
  try {
    const foundShop = await this.findOne({ shop }).exec();
    if (foundShop === null) {
      await this.create({
        shop,
        status: 'ACTIVE',
        mappings: [],
      });
      console.log('Successfully added shop to database');
    } else {
      await this.findOneAndUpdate(
        { shop },
        {
          status: 'ACTIVE',
        }
      ).exec();
      console.log('Updated shop in database');
    }
  } catch (e) {
    console.log(e);
  }
};

const ShopModel = mongoose.model('Shop', shopSchema);
export default ShopModel;
