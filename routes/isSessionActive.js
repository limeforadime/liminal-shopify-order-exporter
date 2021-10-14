import Router from '@koa/router';
import Shopify from '@shopify/shopify-api';
const isSessionActiveRoute = new Router();
import logger from 'npmlog';

isSessionActiveRoute.get('/api/isSessionActive', async (ctx) => {
  const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  logger.info('isSessionActiveRoute: ', 'Checking if session is active:');
  if (
    Shopify.Context.SCOPES.equals(session.scope) &&
    session.accessToken &&
    (!session.expires || new Date() <= session.expires)
  ) {
    logger.info('isSessionActiveRoute: ', 'session is active!');
    ctx.body = { message: 'session is active!' };
  } else {
    logger.info('isSessionActiveRoute: ', 'session NOT active.');
    ctx.body = { message: 'session is NOT active!' };
    ctx.throw(500, 'session not active');
  }
});

export default isSessionActiveRoute;
