/**
 * Combine all routers here
 *
 * Webhook subscription topics can be found here [Accessed: May 19, 2021]
 * https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic
 */

const combineRouters = require('koa-combine-routers');

const { appUninstallRoute } = require('./appUninstalled');
const { subscriptionsUpdateRoute } = require('./appSubscriptionsUpdate');

const webhookRouters = combineRouters(appUninstallRoute, subscriptionsUpdateRoute);

module.exports = webhookRouters;
