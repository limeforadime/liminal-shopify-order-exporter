import Shopify from '@shopify/shopify-api';

export const getShopifyClient = async (ctx) => {
  const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  return client;
};
