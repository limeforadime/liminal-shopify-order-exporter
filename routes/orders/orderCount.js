import Router from '@koa/router';
import { verifyRequest } from '@shopify/koa-shopify-auth';
import Shopify from '@shopify/shopify-api';
const orderCountRoute = new Router();
import verifySessionActive from '../../utils/server/middleware/verifySessionActive';

// Found out that Shopify's api route for order count doesn't have consistent
// parameters with the get all orders route, so I can't take the user's query
// and test how many results they would have gotten, which would have been displayed
// at the bottom of the Filter card. Instead, I'm just going to use the get all orders
// route but limit by 1 and simply notify the user whether the returned results are
// greater than 0.

orderCountRoute.get(
  '/api/orderCount',
  verifyRequest({ returnHeader: true }),
  verifySessionActive(),
  async (ctx) => {
    try {
      console.log('Order count route hit');
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
      const orders = await client.get({
        path: 'orders',
        query: { limit: '1', status: '', fields: 'null' },
      });
      console.log(`Order count: ${orders.body.orders.length}`);
      ctx.response.body = orders.body.orders.length;
    } catch (err) {
      console.log(err);
      ctx.throw(500, 'Server thrown error inside Order Count route');
    }
  }
);

export default orderCountRoute;
