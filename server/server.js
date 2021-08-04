import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'isomorphic-fetch';
import next from 'next';
import Koa from 'koa';
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';
import Router from '@koa/router';

import dbConnect from '../utils/dbConnect';
import sessionStorage from './sessionStorage';
import SessionModel from '../models/SessionModel';
import webhookRouters from '../webhooks';

import userRoutes from '../routes';
import { appUninstallWebhook } from '../webhooks/appUninstalled';
import { collectionsCreateWebhook } from '../webhooks/collectionsCreate';
import createOrUpdateShopEntry from './createOrUpdateShopEntry';

try {
  (async () => await dbConnect())();
  console.log('Connected to database');
} catch (e) {
  console.log('Could not connect to database');
  process.exit(1);
}

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SHOPIFY_API_SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.July21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: sessionStorage,
});

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  // this is used for "Keygrip" cookie signing, when "signed" = true
  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        console.log('reached afterAuth()');
        const { shop, accessToken } = ctx.state.shopify;
        const { host } = ctx.query;

        // subscribe to pertinent webhooks. Change to Promise.all() eventually for better performance
        try {
          await appUninstallWebhook(shop, accessToken);
          await collectionsCreateWebhook(shop, accessToken);
          // if successful, print current webhook subscriptions to console
          const client = new Shopify.Clients.Graphql(shop, accessToken);
          const topicsResponse = await client.query({
            data: `{
                webhookSubscriptions (first: 10) {
                  edges {
                    node {
                      topic
                    }
                  }
                }
              }`,
          });
          const topics = topicsResponse.body.data.webhookSubscriptions.edges.map((v) => v.node.topic);
          console.dir(`topics: ${topics}`);
        } catch (e) {
          console.log('error subscribing to  webhooks');
          console.log(e);
        }
        // const returnUrl = `https://${Shopify.Context.HOST_NAME}?host=${host}&shop=${shop}`;
        // const subscriptionUrl = await getSubscriptionUrl(accessToken, shop, returnUrl);
        // ctx.redirect(subscriptionUrl);
        await createOrUpdateShopEntry(shop);
        const returnUrl = `https://${Shopify.Context.HOST_NAME}?host=${host}`;
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  /* From docs:
  verifyRequest({
    ...
    if false, redirect the user to OAuth. If true, send back a 403 with the following headers:
      - X-Shopify-API-Request-Failure-Reauthorize: '1'
      - X-Shopify-API-Request-Failure-Reauthorize-Url: '<auth_url_path>'
    defaults to false
    returnHeader: true,
  }),
  */
  router.post('/graphql', verifyRequest({ returnHeader: true }), async (ctx, next) => {
    await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
  });
  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
  server.use(userRoutes());
  server.use(webhookRouters());

  router.get('(/_next/static/.*)', handleRequest);
  router.get('/_next/webpack-hmr', handleRequest);
  router.get('(.*)', async (ctx) => {
    const shop = ctx.query.shop;
    const findShopCount = await SessionModel.countDocuments({ shop });

    if (findShopCount < 2) {
      console.log(`In router.get((.*)), deleting sessions with shop: ${shop}`);
      await SessionModel.deleteMany({ shop });
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`--> Ready on http://localhost:${port}`);
  });
});
