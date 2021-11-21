import Shopify from '@shopify/shopify-api';
import logger from 'npmlog';

const verifySessionActive = () => {
  return async (ctx, next) => {
    try {
      logger.info('isSessionActiveRoute: ', 'Checking if session is active:');
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      if (
        Shopify.Context.SCOPES.equals(session.scope) &&
        session.accessToken &&
        (!session.expires || new Date() <= new Date(session.expires))
      ) {
        logger.info('isSessionActiveRoute: ', 'session is active!');
        await next();
      } else {
        logger.info('isSessionActiveRoute: ', 'session not active.');
        ctx.body = { message: 'session not active' };
        ctx.throw(500, 'session not active');
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default verifySessionActive;
