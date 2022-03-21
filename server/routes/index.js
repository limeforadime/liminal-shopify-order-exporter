/**
 * Combine all routers here
 */
import combineRouters from 'koa-combine-routers';
import customersDataRequest from './gdpr/customersDataRequest';
import customersRedact from './gdpr/customersRedact';
import shopRedact from './gdpr/shopRedact';
import isSessionActiveRoute from './isSessionActive';
import ordersRoute from './shopify-resources/orders/orders';
import orderCountRoute from './shopify-resources/orders/orderCount';
import saveExportToDB from './shopify-resources/orders/saveExportToDB';
import profilesRoute from './profiles/profiles';

const userRoutes = combineRouters(
  customersDataRequest,
  customersRedact,
  shopRedact,
  isSessionActiveRoute,
  ordersRoute,
  orderCountRoute,
  saveExportToDB,
  profilesRoute
);

export default userRoutes;
