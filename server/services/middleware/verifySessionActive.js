import Shopify from '@shopify/shopify-api';
import logger from 'npmlog';

const verifySessionActive = () => {
  return async (ctx, next) => {
    try {
      logger.info('isSessionActiveRoute: ', 'Checking if session is active:');
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      if (!session) ctx.throw(500, 'session not found');

      const { scope, accessToken, expires, shop } = session;
      if (
        Shopify.Context.SCOPES.equals(scope) &&
        accessToken &&
        (!expires || new Date() <= new Date(expires))
      ) {
        logger.info('isSessionActiveRoute: ', 'session is active!');
        await next();
      } else {
        ctx.throw(500, 'session not active');
        // ctx.body = { message: 'session not active' };
      }
    } catch (err) {
      console.log(err);
      logger.info('INFO isSessionActiveRoute: ', err.message);
      logger.info(`INFO redirecting to auth with shop: ${shop}`);
      ctx.redirect(`/auth?shop=${shop}`);
    }
  };
};

export default verifySessionActive;
