const { Shopify } = require('@shopify/shopify-api');
const StoreDetailsModel = require('../models/StoreDetailsModel');

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
  const response = await client.query({
    data: query,
  });

  const { id, status } = response.body.data.appSubscriptionCreate.appSubscription;

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

  return response.body.data.appSubscriptionCreate.confirmationUrl;
};

module.exports = getSubscriptionUrl;
