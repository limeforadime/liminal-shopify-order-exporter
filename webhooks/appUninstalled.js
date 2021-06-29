/**
 * Use this as a template for creating new webhooks
 *
 * Add the webhook to server.js
 * Add router to webhooks/index.js
 *
 */
const { ApiVersion } = require('@shopify/shopify-api');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const Router = require('@koa/router');
const StoreDetailsModel = require('../models/StoreDetailsModel');
const SessionModel = require('../models/SessionModel');
const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });
const appUninstallRoute = new Router(); //Update route variable
const webhookUrl = '/webhooks/app/uninstall';

const appUninstallWebhook = async (shop, accessToken) => {
  const webhookStatus = await registerWebhook({
    address: `${process.env.HOST}${webhookUrl}`,
    topic: 'APP_UNINSTALLED',
    accessToken,
    shop,
    apiVersion: ApiVersion.April21,
  });

  webhookStatus.success
    ? console.log(`--> Successfully registered uninstall webhook! for ${shop}`)
    : console.log(
        '--> Failed to register uninstall webhook',
        webhookStatus.result.data.webhookSubscriptionCreate.userErrors
      );
};

appUninstallRoute.post(webhookUrl, webhook, async (ctx) => {
  const shop = ctx.state.webhook.payload.domain;
  await SessionModel.deleteMany({ shop }, (error, data) => {
    if (error) {
      console.log('--> An error occured: ', error.message);
    } else {
      console.log(`--> Successfully delete sessions data for ${shop}`);
    }
  });

  await StoreDetailsModel.updateMany(
    { shop, status: 'ACTIVE' },
    { status: 'CANCELLED', updated_at: Date.now() },
    (error, data) => {
      if (error) {
        console.log('--> An error occured: ', error.message);
      } else {
        console.log(`--> Successfully updated subscription status for ${shop}`);
      }
    }
  );
});

module.exports = { appUninstallWebhook, appUninstallRoute };
