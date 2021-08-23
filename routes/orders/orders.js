/*
Payload
{
  shop_id: 954889,
  shop_domain: "snowdevil.myshopify.com",
};
*/
import Router from '@koa/router';
import { verifyRequest } from '@shopify/koa-shopify-auth';
import Shopify from '@shopify/shopify-api';
const ordersRoute = new Router();

ordersRoute.get(
  '/api/orders',
  // async (ctx, next) => {
  //   try {
  //     /* Forced fail zone */
  //     ctx.set('X-Shopify-API-Request-Failure-Reauthorize', '1');
  //     ctx.status = 401;
  //     await next();
  //   } catch (e) {
  //     ctx.throw(500, 'Server thrown error inside test middleware');
  //   }
  // },
  verifyRequest({ returnHeader: true }),
  async (ctx) => {
    // TODO: logic to verify something in the header sent from client such as the API key
    /* Example logic from an example I saw:
      const storeUrl = await getSession(ctx)
      if (storeUrl === null) {
          ctx.body = { error: 'Invalid session' }
          ctx.res.statusCode = 403
          return
      }
      const getSession = async (ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any>, any>): Promise<string | null> => {
          const token = ((ctx.get('Authorization') || '') as string).replace('Bearer ', '')
          let session: string | null = null
          try {
              const sessionData = await jwt.verify(token, process.env.SHOPIFY_API_SECRET as string) as { dest: string }
              session = sessionData.dest.replace('https://', '')
          } catch {
              session = null
          }
          return session
      }
  */
    console.log('All orders route hit');
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const orders = await client.get({
      path: 'orders',
    });
    console.log(orders.body.orders);
    ctx.response.body = orders.body.orders;
  }
);

export default ordersRoute;

/*

*/
