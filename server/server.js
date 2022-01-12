import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'isomorphic-fetch';
import next from 'next';
import Koa from 'koa';
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import Shopify, { ApiVersion } from '@shopify/shopify-api';
import Router from '@koa/router';

import dbConnect from '../utils/server/dbConnect';
import sessionStorage from './sessionStorage';
import SessionModel from '../models/SessionModel';
import StoreDetailsModel from '../models/StoreDetailsModel';
import webhookRouters from '../webhooks';
import forcedFailMiddleware from '../utils/server/middleware/forcedFailMiddleware';

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
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.October21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: sessionStorage,
  // SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
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
        // const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res, true);
        const session = ctx.state.shopify;
        const { shop, accessToken } = session;
        console.log('shop: ', shop);
        const { host } = ctx.query;
        try {
          await appUninstallWebhook(shop, accessToken);
          await collectionsCreateWebhook(shop, accessToken);
        } catch (e) {
          console.log('error subscribing to webhooks');
          console.log(e);
        }
        await createOrUpdateShopEntry(shop);
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );
  // router.get('/auth', async (ctx) => {
  //   try {
  //     const { shop } = ctx.query;
  //     console.log(`In /auth. shop: ${shop}`);
  //     let authRoute = await Shopify.Auth.beginAuth(ctx.req, ctx.res, shop, '/auth/callback');
  //     console.log(`authRoute: ${authRoute}`);
  //     ctx.redirect(authRoute);
  //   } catch (err) {
  //     console.error('/auth: Failed to complete OAuth process');
  //     console.error(err);
  //   }
  // });

  // router.get('/auth/callback', async (ctx) => {
  //   const { shop, host } = ctx.query;
  //   try {
  //     console.log('reached /auth/callback');
  //     console.log(`shop: ${shop}`);
  //     console.log(`host: ${host}`);

  //     const session = await Shopify.Auth.validateAuthCallback(ctx.req, ctx.res, ctx.query);
  //     const { accessToken } = session;
  //     // await appUninstallWebhook(shop, accessToken);
  //     // await collectionsCreateWebhook(shop, accessToken);
  //     await createOrUpdateShopEntry(shop);
  //     // ctx.redirect(`${process.env.HOST}?shop=${shop}&host=${host}`);
  //     console.log();
  //     ctx.redirect(`/?shop=${shop}&host=${host}`);
  //   } catch (err) {
  //     console.error('/auth/callback: Failed to complete OAuth process');
  //     console.log(err);
  //   }
  // });

  router.post(
    '/graphql',
    // forcedFailMiddleware,
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
      const findShopCount = await StoreDetailsModel.countDocuments({ shop }).clone();

      if (findShopCount < 1) {
        console.log('(*) route: didnt find shop, redirecting to /auth?shop=shop');
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
