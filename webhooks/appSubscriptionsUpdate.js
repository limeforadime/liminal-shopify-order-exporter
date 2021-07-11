import { Shopify } from '@shopify/shopify-api';
import StoreDetailsModel from '../models/StoreDetailsModel';

const subscriptionsUpdateWebhook = async (shop, accessToken) => {
  try {
    const response = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'APP_SUBSCRIPTIONS_UPDATE',
      accessToken,
      shop,
      webhookHandler: handleSubscriptionsUpdateRequest,
    });
    console.log(`--> Successfully registered subscriptions_update webhook! for ${shop}`);
  } catch (e) {
    console.log('--> Failed to register subscriptions_update webhook');
    console.log(e);
  }
};

const handleSubscriptionsUpdateRequest = async (topic, shop, webhookRequestBody) => {
  console.log(`running ${topic} webhook handler`);
  const parsedWebhookRequestBody = JSON.parse(webhookRequestBody);
  const { admin_graphql_api_id, updated_at, status } = parsedWebhookRequestBody.app_subscription;
  try {
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
  } catch (e) {
    console.log(e);
  }
};

export { subscriptionsUpdateWebhook, handleSubscriptionsUpdateRequest };
