/**
 * Combine all routers here
 */

// import combineRouters from 'koa-combine-routers';
import combineRouters from 'koa-combine-routers';
import customersDataRequest from './gdpr/customersDataRequest';
import customersRedact from './gdpr/customersRedact';
import shopRedact from './gdpr/shopRedact';
import orders from './orders/orders';
import triggerOauth from './triggerOauth';

const userRoutes = combineRouters(customersDataRequest, customersRedact, shopRedact, orders, triggerOauth);

export default userRoutes;
