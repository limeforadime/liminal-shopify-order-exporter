/**
 * Combine all routers here
 *
 * Webhook subscription topics can be found here [Accessed: May 19, 2021]
 * https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic
 */

import combineRouters from 'koa-combine-routers';

import { appUninstallRoute } from './appUninstalled';
import { collectionsCreateRoute } from './collectionsCreate';

const webhookRouters = combineRouters(appUninstallRoute, collectionsCreateRoute);

export default webhookRouters;
