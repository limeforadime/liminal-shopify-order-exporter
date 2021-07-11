import { Shopify } from '@shopify/shopify-api';
import StoreDetailsModel from '../models/StoreDetailsModel';

const collectionsCreateWebhook = async (shop, accessToken) => {
  try {
    const response = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'COLLECTIONS_CREATE',
      accessToken,
      shop,
      webhookHandler: handleCollectionsCreateRequest,
    });
    console.log(`--> Successfully registered COLLECTIONS_CREATE webhook! for ${shop}`);
  } catch (e) {
    console.log('--> Failed to register COLLECTIONS_CREATE webhook');
    console.log(e);
  }
};

const handleCollectionsCreateRequest = async (topic, shop, webhookRequestBody) => {
  console.log(`running ${topic} webhook handler`);
  const parsedWebhookRequestBody = JSON.parse(webhookRequestBody);
  const { title } = parsedWebhookRequestBody;
  console.log(`collection title: ${title}`);
};

export { collectionsCreateWebhook, handleCollectionsCreateRequest };
