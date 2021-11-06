import Router from '@koa/router';
import Shopify from '@shopify/shopify-api';
const isSessionActiveRoute = new Router();
import logger from 'npmlog';

isSessionActiveRoute.get('/api/isSessionActive', async (ctx) => {
  try {
    logger.info('isSessionActiveRoute: ', 'Checking if session is active:');
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    logger.info('isSessionActiveRoute: ', 'Reached? session NOT active.');
    if (
      Shopify.Context.SCOPES.equals(session.scope) &&
      session.accessToken &&
      (!session.expires || new Date() <= session.expires)
    ) {
      logger.info('isSessionActiveRoute: ', 'session is active!');
      ctx.body = { message: 'session is active!' };
    } else {
      logger.info('isSessionActiveRoute: ', 'session NOT active.');
      logger.info('isSessionActiveRoute: ', `session.expires: ${session.expires ? session.expires : null}`);
      ctx.body = { message: 'session is NOT active!' };
      ctx.throw(500, 'session not active');
    }
  } catch (err) {
    console.log(err);
  }
});

export default isSessionActiveRoute;
