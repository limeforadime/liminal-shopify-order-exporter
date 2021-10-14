const forcedFailMiddleware = async (ctx, next) => {
  try {
    /* Forced fail zone */
    console.log('Running forced failure middleware');
    ctx.set('X-Shopify-API-Request-Failure-Reauthorize', '1');
  } catch (err) {
    ctx.throw(500, 'Server thrown error inside test middleware');
  }
};

export default forcedFailMiddleware;
