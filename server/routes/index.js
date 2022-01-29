/**
 * Combine all routers here
 */

// import combineRouters from 'koa-combine-routers';
import combineRouters from 'koa-combine-routers';
import customersDataRequest from './gdpr/customersDataRequest';
import customersRedact from './gdpr/customersRedact';
import shopRedact from './gdpr/shopRedact';
// import triggerOauth from './triggerOauth';
import isSessionActiveRoute from './isSessionActive';
import ordersRoute from './orders/orders';
import orderCountRoute from './orders/orderCount';
import mappingsRoute from './mappings/mappings';

const userRoutes = combineRouters(
  customersDataRequest,
  customersRedact,
  shopRedact,
  ordersRoute,
  mappingsRoute,
  orderCountRoute,
  isSessionActiveRoute
  // triggerOauth
);

export default userRoutes;
