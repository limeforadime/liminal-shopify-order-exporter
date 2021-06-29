require('isomorphic-fetch');
require('dotenv').config();
const next = require('next');
const Koa = require('koa');
const { default: createShopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');
const Router = require('@koa/router');

const mongoose = require('mongoose');
const dbConnect = require('./server/dbConnect');
const sessionStorage = require('./server/sessionStorage');
const SessionModel = require('./models/SessionModel');

const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const userRoutes = require('./routes');
const webhookRouters = require('./webhooks');
const { appUninstallWebhook } = require('./webhooks/appUninstalled');
const { subscriptionsUpdateWebhook } = require('./webhooks/appSubscriptionsUpdate');

// const mongoUrl = process.env.MONGO_URL;

// mongoose.connect(
//   mongoUrl,
//   {
//     useFindAndModify: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => console.log('Connected to database')
// );
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
  API_VERSION: ApiVersion.April21,
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

        appUninstallWebhook(shop, accessToken);
        subscriptionsUpdateWebhook(shop, accessToken);
        console.log('did we even get here during auth?');
        const returnUrl = `https://${Shopify.Context.HOST_NAME}?host=${host}&shop=${shop}`;
        const subscriptionUrl = await getSubscriptionUrl(accessToken, shop, returnUrl);
        ctx.redirect(subscriptionUrl);
      },
    })
  );

  router.post('/graphql', verifyRequest({ returnHeader: true }), async (ctx, next) => {
    await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
  });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get('/', async (ctx) => {
    const shop = ctx.query.shop;
    const findShopCount = await SessionModel.countDocuments({ shop });

    if (findShopCount < 2) {
      await SessionModel.deleteMany({ shop });
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(webhookRouters());
  server.use(userRoutes());

  router.get('(/_next/static/.*)', handleRequest);
  router.get('/_next/webpack-hmr', handleRequest);
  router.get('(.*)', verifyRequest(), handleRequest);

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`--> Ready on http://localhost:${port}`);
  });
});
