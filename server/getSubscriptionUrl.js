import Shopify from '@shopify/shopify-api';
import StoreDetailsModel from '../models/StoreDetailsModel';

const getSubscriptionUrl = async (accessToken, shop, returnUrl) => {
  const query = `mutation {
    appSubscriptionCreate(
      name: "Basic Plan"
      returnUrl: "${returnUrl}"
      test: true
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 10, currencyCode: USD }
            }
          }
        }
      ]
    )
    {
      userErrors {
        field
        message
      }
      confirmationUrl
      appSubscription {
        id
        status
      }
    }
  }`;

  const client = new Shopify.Clients.Graphql(shop, accessToken);

  try {
    const response = await client.query({
      data: query,
    });
    const { id, status } = response.body.data.appSubscriptionCreate.appSubscription;
    const { confirmationUrl } = response.body.data.appSubscriptionCreate;
    const result = await StoreDetailsModel.findOne({
      subscriptionChargeId: id,
    });

    if (result === null) {
      await StoreDetailsModel.create({
        shop,
        subscriptionChargeId: id,
        status,
      });
    } else {
      await StoreDetailsModel.findOneAndUpdate(
        { shop },
        {
          subscriptionChargeId: id,
          status,
        }
      );
    }
    return confirmationUrl;
  } catch (e) {
    console.log(e);
  }
};

export default getSubscriptionUrl;
