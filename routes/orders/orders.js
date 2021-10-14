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
import forcedFailMiddleware from '../../utils/forcedFailMiddleware';

ordersRoute.get(
  '/api/orders',
  // forcedFailMiddleware,
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
    console.log('Checking if session is active: ');
    if (
      Shopify.Context.SCOPES.equals(session.scope) &&
      session.accessToken &&
      (!session.expires || new Date() <= session.expires)
    ) {
      console.log('session is active!');
    } else {
      console.log('session NOT active.');
      ctx.throw(500, 'session not active');
    }
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const orders = await client.get({
      path: 'orders',
    });
    console.log('Orders:');
    console.log(orders.body.orders);
    ctx.response.body = orders.body.orders;
  }
);

export default ordersRoute;

/*

*/
