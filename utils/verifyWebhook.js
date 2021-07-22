/*
Middleware options
When creating a public middleware, it's useful to conform to the convention of 
wrapping the middleware in a function that accepts options, 
allowing users to extend functionality. Even if your middleware accepts no options, 
this is still a good idea to keep things uniform.

Here our contrived logger middleware accepts a format string for customization, 
and returns the middleware itself:

function logger(format) {
  format = format || ':method ":url"';

  return async function (ctx, next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);

    console.log(str);

    await next();
  };
}

app.use(logger());
app.use(logger(':method :url'));
*/

import crypto from 'crypto';
import getRawBody from 'raw-body';
import contentType from 'content-type';

const verifyWebhook = () => {
  return async (ctx, next) => {
    console.log('Running webhook verification middleware to see if request came from Shopify');
    try {
      // const rawBody = await getRawBody(ctx.req);
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
        // ctx.response.body = { response: 'Verification failed: Request must originate from Shopify' };
        // ctx.response.status = 401;
        await next();
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export default verifyWebhook;
