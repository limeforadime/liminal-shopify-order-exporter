import StoreDetailsModel from '../models/StoreDetailsModel';

const createOrUpdateShopEntry = async (shop) => {
  try {
    const foundShop = await StoreDetailsModel.findOne({
      shop,
    });

    if (foundShop === null) {
      await StoreDetailsModel.create({
        shop,
        status: 'ACTIVE',
      });
      console.log('Successfully added shop to database');
    } else {
      await StoreDetailsModel.findOneAndUpdate(
        { shop },
        {
          status: 'ACTIVE',
        }
      );
      console.log('Updated shop in database');
    }
  } catch (e) {
    console.log(e);
  }
};

export default createOrUpdateShopEntry;
