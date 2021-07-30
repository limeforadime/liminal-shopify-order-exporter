/*
Payload
{
  shop_id: 954889,
  shop_domain: "snowdevil.myshopify.com",
};
*/
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import Shopify from '@shopify/shopify-api';
const orders = new Router();

orders.get('/api/orders', async (ctx) => {
  // TODO: logic to verify something in the header sent from client such as the API key
  console.log('All orders route hit');
  const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  console.log(session);
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  console.log('orders:');
  const orders = await client.get({
    path: 'orders',
  });
  console.log(orders);
  ctx.response.body = { message: 'Good job pogchamp you did it' };
});

export default orders;
