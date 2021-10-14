/**
 * Combine all routers here
 */

// import combineRouters from 'koa-combine-routers';
import combineRouters from 'koa-combine-routers';
import customersDataRequest from './gdpr/customersDataRequest';
import customersRedact from './gdpr/customersRedact';
import shopRedact from './gdpr/shopRedact';
import ordersRoute from './orders/orders';
// import triggerOauth from './triggerOauth';
import isSessionActiveRoute from './isSessionActive';

const userRoutes = combineRouters(
  customersDataRequest,
  customersRedact,
  shopRedact,
  ordersRoute,
  isSessionActiveRoute
  // triggerOauth
);

export default userRoutes;
