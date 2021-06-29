const { ApiVersion } = require('@shopify/shopify-api');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const Router = require('@koa/router');
const StoreDetailsModel = require('../models/StoreDetailsModel');
const subscriptionsUpdateRoute = new Router();
const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });
const webhookUrl = '/webhooks/app/subscriptions/update';

const subscriptionsUpdateWebhook = async (shop, accessToken) => {
  const webhookStatus = await registerWebhook({
    address: `${process.env.HOST}${webhookUrl}`,
    topic: 'APP_SUBSCRIPTIONS_UPDATE',
    accessToken,
    shop,
    apiVersion: ApiVersion.April21,
  });

  webhookStatus.success
    ? console.log(`--> Successfully registered subscriptions_update webhook! for ${shop}`)
    : console.log(
        '--> Failed to register subscriptions_update webhook',
        webhookStatus.result.data.webhookSubscriptionCreate.userErrors
      );
};

subscriptionsUpdateRoute.post(webhookUrl, webhook, async (ctx) => {
  const { admin_graphql_api_id, updated_at, status } = ctx.request.body.app_subscription;

  const findSubscription = await StoreDetailsModel.find({
    subscriptionChargeId: admin_graphql_api_id,
  });

  if (findSubscription) {
    await StoreDetailsModel.findOneAndUpdate(
      {
        subscriptionChargeId: admin_graphql_api_id,
      },
      { updated_at, status }
    );
  } else {
    console.log('--> Subscription not found', findSubscription);
  }
});

module.exports = { subscriptionsUpdateRoute, subscriptionsUpdateWebhook };
