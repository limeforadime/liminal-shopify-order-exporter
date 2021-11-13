const forcedFailMiddleware = async (ctx, next) => {
  /* Forced fail zone */
  console.log('Running forced failure middleware');
  ctx.set('X-Shopify-API-Request-Failure-Reauthorize', '1');
  ctx.throw(500, 'Server thrown error inside test middleware');
};

export default forcedFailMiddleware;
