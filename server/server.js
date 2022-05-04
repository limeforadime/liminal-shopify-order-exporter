import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'isomorphic-fetch';
import next from 'next';
import Koa from 'koa';
import { createShopifyAuth, verifyRequest } from 'simple-koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';
import Router from '@koa/router';

import dbConnect from './services/dbConnect';
import sessionStorage from './sessionStorage';
import ShopModel from './models/ShopModel';
import webhookRouters from './webhooks';

import userRoutes from './routes';
import { appUninstallWebhook } from './webhooks/appUninstalled';

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
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.October21,
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
        console.log('attempting to retrieve session...');
        const session = ctx.state.shopify;
        const { shop, accessToken } = session;
        console.log('shop: ', shop);
        const { host } = ctx.query;
        try {
          await appUninstallWebhook(shop, accessToken);
        } catch (err) {
          console.log('error subscribing to webhooks');
          console.log(err);
        }
        await ShopModel.createOrUpdateShop(shop);
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  router.post(
    '/graphql',
    async (ctx, next) => {
      await next();
    },
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

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
    console.log('reached (*) route');
    const { shop } = ctx.query;
    try {
      if (shop == undefined) {
        console.log('shop query undefined; returning from function');
        throw new Error('Fatal: Shop query undefined, cannot go further');
      }
      const foundShop = await ShopModel.findOne({ shop }).clone();

      if (!foundShop) {
        console.log(`(*) route: didnt find shop, redirecting to /auth with shop of ${shop}`);
        ctx.redirect(`/auth?shop=${shop}`);
      } else {
        console.log('(*) route: successful, handling request now');
        await handleRequest(ctx);
      }
    } catch (err) {
      console.log(err);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`--> Ready on http://localhost:${port}`);
  });
});
