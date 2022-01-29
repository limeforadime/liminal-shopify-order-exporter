// import ShopModel from './models/ShopModel';

// const createOrUpdateShopEntry = async (shop) => {
//   try {
//     const foundShop = await ShopModel.findOne({ shop }).exec();
//     if (foundShop === null) {
//       await ShopModel.create({
//         shop,
//         status: 'ACTIVE',
//         mappings: [],
//       });
//       console.log('Successfully added shop to database');
//     } else {
//       await ShopModel.findOneAndUpdate(
//         { shop },
//         {
//           status: 'ACTIVE',
//         }
//       ).exec();
//       console.log('Updated shop in database');
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };

// export default createOrUpdateShopEntry;
