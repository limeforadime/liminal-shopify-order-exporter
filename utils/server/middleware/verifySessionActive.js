import Shopify from '@shopify/shopify-api';
import logger from 'npmlog';

/* May be able to use Session.isActive() for this same functionality, 
not sure if it's the same 
*/
const verifySessionActive = () => {
  return async (ctx, next) => {
    try {
      logger.info('isSessionActiveRoute: ', 'Checking if session is active:');
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      const { scope, accessToken, expires, shop } = session;
      // if (
      //   Shopify.Context.SCOPES.equals(session.scope) &&
      //   session.accessToken &&
      //   (!session.expires || new Date() <= new Date(session.expires))
      // ) {
      if (false) {
        logger.info('isSessionActiveRoute: ', 'session is active!');
        await next();
      } else {
        logger.info('INFO isSessionActiveRoute: ', 'session not active.');
        logger.info(`INFO redirecting to auth with shop: ${shop}`);
        ctx.redirect(`/auth?shop=${shop}`);
        ctx.throw(500, 'session not active');
        // ctx.body = { message: 'session not active' };
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default verifySessionActive;
