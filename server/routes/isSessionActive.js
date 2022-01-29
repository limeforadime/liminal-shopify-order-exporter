import Router from '@koa/router';
const isSessionActiveRoute = new Router();

import verifySessionActive from '../../utils/server/middleware/verifySessionActive';

isSessionActiveRoute.get('/api/isSessionActive', verifySessionActive(), async (ctx, next) => {
  ctx.body = { message: 'session is active!' };
});

export default isSessionActiveRoute;
