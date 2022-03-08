// /admin/api/2022-01/orders/{order_id}/transactions.json
import Router from '@koa/router';
import { verifyRequest } from 'simple-koa-shopify-auth';
import Shopify from '@shopify/shopify-api';
const transactionsRoute = new Router();

transactionsRoute.get('/api/transactions', verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const query = ctx.query;
    const { orderId } = query;
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const transactions = await client.get({
      path: `orders/${orderId}/transactions`,
    });
    ctx.body = transactions.body.transactions;
  } catch (err) {
    console.log(err);
    ctx.throw(500, 'Server thrown error inside Orders route');
  }
});

export default transactionsRoute;
