/**
 * Use this as a template for creating new webhooks
 *
 * Add the webhook to server.js
 * Add router to webhooks/index.js
 *
 */
import { Shopify } from '@shopify/shopify-api';
import StoreDetailsModel from '../models/StoreDetailsModel';
import SessionModel from '../models/SessionModel';

const appUninstallWebhook = async (shop, accessToken) => {
  try {
    const response = await Shopify.Webhooks.Registry.register({
      path: '/webhooks',
      topic: 'APP_UNINSTALLED',
      accessToken,
      shop,
      webhookHandler: handleAppUninstallRequest,
    });
    console.log(`--> Successfully registered app_uninstall webhook for ${shop}`);
  } catch (e) {
    console.log(`--> Failed to register app_uninstall webhook for ${shop}`);
    console.log(e);
  }
};

const handleAppUninstallRequest = async (topic, shop, webhookRequestBody) => {
  console.log(`running ${topic} webhook handler`);
  try {
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
  } catch (e) {
    console.log(e);
  }
};

export { appUninstallWebhook, handleAppUninstallRequest };
