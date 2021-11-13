import crypto from 'crypto';

const verifyWebhook = () => {
  return async (ctx, next) => {
    console.log('Running webhook verification middleware to see if request came from Shopify');
    try {
      const rawBody = ctx.request.rawBody;
      const hmac = ctx.request.get('X-Shopify-Hmac-Sha256');
      const hash = crypto
        .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
        .update(rawBody, 'utf-8')
        .digest('base64');
      if (hmac === hash) {
        console.log('√ Request is verified from Shopify!');
        await next();
      } else {
        console.log('Verification failed: Request must originate from Shopify');
        ctx.response.body = { response: 'Verification failed: Request must originate from Shopify' };
        ctx.response.status = 401;
        await next();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default verifyWebhook;
