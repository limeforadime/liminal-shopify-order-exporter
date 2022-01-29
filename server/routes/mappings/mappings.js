import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { verifyRequest } from 'simple-koa-shopify-auth';
import Shopify from '@shopify/shopify-api';
import MappingModel from '../../models/MappingModel';
import ShopModel from '../../models/ShopModel';
import { getShopFromAuthHeader } from '../../../utils/server/getShopFromAuthHeader';
const mappingsRoute = new Router();

// shop name for temp debugging/development
const shop = 'test-store-testing-testing-wuddup.myshopify.com';

// GET all mappings
mappingsRoute.get('/api/mappings', async (ctx, next) => {});

// POST create a new mapping profile
mappingsRoute.post(
  '/api/mappings/create',
  bodyParser(),
  // verifyRequest({ returnHeader: true }),
  async (ctx, next) => {
    const body = ctx.request.body;
    if (Object.keys(body).length == 0) ctx.throw(400, 'Invalid body');

    const { mappingName } = body;
    try {
      // const shop = getShopFromAuthHeader(ctx);
      if (!shop) throw new Error('Couldnt get shop from header');

      const foundShop = await ShopModel.findOne({ shop }).exec();
      if (!foundShop) throw new Error('Couldnt retrieve shop from database');

      await foundShop.addNewMapping(mappingName);
      ctx.body = {
        message: 'cool, received it. ',
      };
    } catch (err) {
      console.log(err);
    }
  }
);

// PUT rename mapping profile
// consider whether or not to use this or just a single all purpose mapping update route
mappingsRoute.patch(
  '/api/mappings/rename',
  bodyParser(),
  // verifyRequest({ returnHeader: true }),
  async (ctx, next) => {
    try {
      const { id, newName } = ctx.request.body;
      if (!id || !newName || newName.length == 0) ctx.throw(400, 'Invalid input');

      const mapping = await MappingModel.findById(id).exec();
      mapping.name = newName;
      await mapping.save();
      ctx.body = {
        message: 'cool, changed the mapping name',
      };
    } catch (err) {
      console.log(err);
    }
  }
);

// DELETE a mapping profile
mappingsRoute.delete(
  '/api/mappings/delete',
  bodyParser(),
  // verifyRequest({ returnHeader: true }),
  async (ctx, next) => {
    try {
      const { id } = ctx.request.body;
      if (!id) ctx.throw(400, 'Invalid input');

      await MappingModel.findByIdAndDelete(id).exec();
      ctx.body = {
        message: 'cool, deleted it',
      };
    } catch (err) {
      console.log(err);
    }
  }
);
export default mappingsRoute;
