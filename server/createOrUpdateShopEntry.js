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
    } else {
      await StoreDetailsModel.findOneAndUpdate(
        { shop },
        {
          status: 'ACTIVE',
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export default createOrUpdateShopEntry;
