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
import transactionsRoute from './shopify-resources/transactions';
import fulfillmentsRoute from './shopify-resources/fulfillments';
import fulfillmentOrdersRoute from './shopify-resources/fulfillmentOrders';
import profilesRoute from './profiles/profiles';

const userRoutes = combineRouters(
  customersDataRequest,
  customersRedact,
  shopRedact,
  isSessionActiveRoute,
  ordersRoute,
  orderCountRoute,
  profilesRoute,
  transactionsRoute,
  fulfillmentsRoute,
  fulfillmentOrdersRoute
);

export default userRoutes;
