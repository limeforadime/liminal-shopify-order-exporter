const Router = require('@koa/router');
const templateRoute = new Router();

templateRoute.post('/templateRoute', async (ctx) => {
  ctx.body = 'It works!';
});

module.exports = templateRoute;
