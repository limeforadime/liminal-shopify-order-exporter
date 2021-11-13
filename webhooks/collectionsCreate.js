import bodyParser from 'koa-bodyparser';
import { receiveWebhook, registerWebhook } from '@shopify/koa-shopify-webhooks';
import { ApiVersion } from '@shopify/shopify-api';
import verifyWebhook from '../utils/server/middleware/verifyWebhook';
const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });
import Router from '@koa/router';
const collectionsCreateRoute = new Router();
const webhookUrl = '/webhooks/app/collections_create';

const collectionsCreateWebhook = async (shop, accessToken) => {
  const webhookStatus = await registerWebhook({
    address: `${process.env.HOST}${webhookUrl}`,
    topic: 'COLLECTIONS_CREATE',
    accessToken,
    shop,
    apiVersion: ApiVersion.July21,
  });

  webhookStatus.success
    ? console.log(`--> Successfully registered collections create webhook! for ${shop}`)
    : console.log(
        '--> Failed to register collections create webhook',
        webhookStatus.result.data.webhookSubscriptionCreate.userErrors
      );
};

collectionsCreateRoute.post(webhookUrl, webhook, bodyParser(), verifyWebhook(), async (ctx) => {
  console.log(`running collections create webhook handler`);
  console.log('hey wuddup');
  console.dir(ctx.state.webhook);
  /* Returns:
  {
    ┃   topic: 'COLLECTIONS_CREATE',
    ┃   domain: 'asdfasdf123.myshopify.com',
    ┃   payload: {
    ┃     id: 273505419418,
    ┃     handle: 'uuuuuuuuuuuuuuuu',
    ┃     title: 'uuuuuuuuuuuuuuuu',
    ┃     updated_at: '2021-07-22T07:04:35-04:00',
    ┃     body_html: '',
    ┃     published_at: '2021-07-22T07:04:35-04:00',
    ┃     sort_order: 'best-selling',
    ┃     template_suffix: '',
    ┃     disjunctive: false,
    ┃     rules: [ [Object] ],
    ┃     published_scope: 'web',
    ┃     admin_graphql_api_id: 'gid://shopify/Collection/273505419418'
    ┃   }
    ┃ }
    */
});

export { collectionsCreateWebhook, collectionsCreateRoute };
