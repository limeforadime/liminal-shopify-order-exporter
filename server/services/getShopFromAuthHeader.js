import Shopify from '@shopify/shopify-api';

const getShopFromAuthHeader = (ctx) => {
  const authHeader = ctx.req.headers.authorization;
  const matches = authHeader?.match(/Bearer (.*)/);
  if (matches) {
    const payload = Shopify.Utils.decodeSessionToken(matches[1]);
    const shop = payload.dest.replace('https://', '');
    return shop;
  }
  return null;
};

export { getShopFromAuthHeader };
