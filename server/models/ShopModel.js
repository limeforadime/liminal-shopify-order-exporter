/**
 * Model to store transactional IDs irrespective of current store status.
 */
import mongoose from 'mongoose';
const { Schema } = mongoose;
import ProfileModel, { profileSchema } from './ProfileModel';

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
    profiles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

shopSchema.methods.addNewProfile = async function (profileName, fields, selectedTags) {
  const newProfile = await ProfileModel.create({
    ownerShop: this.shop,
    name: profileName,
    settings: {
      global: {},
      selectedTags,
      fields,
    },
  });
  const updatedProfiles = [...this.profiles];
  updatedProfiles.push(newProfile);
  this.profiles = updatedProfiles;
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
        profiles: [],
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
