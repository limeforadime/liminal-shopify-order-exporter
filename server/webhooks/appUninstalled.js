import { receiveWebhook, registerWebhook } from '@shopify/koa-shopify-webhooks';
import { ApiVersion } from '@shopify/shopify-api';
import verifyWebhook from '../../utils/server/middleware/verifyWebhook';
const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });
import Router from '@koa/router';
import SessionModel from '../models/SessionModel';
import ShopModel from '../models/ShopModel';
const appUninstallRoute = new Router();
const webhookUrl = '/webhooks/app/uninstall';

const appUninstallWebhook = async (shop, accessToken) => {
  const webhookStatus = await registerWebhook({
    address: `${process.env.HOST}${webhookUrl}`,
    topic: 'APP_UNINSTALLED',
    accessToken,
    shop,
    apiVersion: 'unstable',
  });

  webhookStatus.success
    ? console.log(`--> Successfully registered uninstall webhook! for ${shop}`)
    : console.log(
        '--> Failed to register uninstall webhook',
        webhookStatus.result.data.webhookSubscriptionCreate.userErrors
      );
};

appUninstallRoute.post(webhookUrl, webhook, verifyWebhook(), async (ctx) => {
  console.log(`running appUninstall webhook handler`);
  const shop = ctx.state.webhook.payload.domain;
  try {
    await SessionModel.deleteMany({ shop }, (error, data) => {
      if (error) {
        console.log('--> An error occured: ', error.message);
      } else {
        console.log(`--> Successfully delete sessions data for ${shop}`);
      }
    });

    await ShopModel.updateMany(
      { shop, status: 'ACTIVE' },
      { status: 'CANCELLED', updated_at: Date.now() },
      (error, data) => {
        if (error) {
          console.log('--> An error occured: ', error.message);
        } else {
          console.log(`--> Successfully updated status for ${shop}`);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});

export { appUninstallWebhook, appUninstallRoute };
