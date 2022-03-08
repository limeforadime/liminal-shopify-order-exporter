// /admin/api/2022-01/orders/{order_id}/transactions.json
import Router from '@koa/router';
import { verifyRequest } from 'simple-koa-shopify-auth';
import Shopify from '@shopify/shopify-api';
const fulfillmentOrdersRoute = new Router();

fulfillmentOrdersRoute.get('/api/fulfillment_orders', verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const query = ctx.query;
    const { orderId } = query;
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const fulfillmentOrders = await client.get({
      path: `orders/${orderId}/fulfillment_orders`,
    });
    ctx.body = fulfillmentOrders.body.fulfillment_orders;
  } catch (err) {
    console.log(err);
    ctx.throw(500, 'Server thrown error inside fulfillment_orders route.');
  }
});

export default fulfillmentOrdersRoute;
