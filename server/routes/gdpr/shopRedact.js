import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
const shopRedact = new Router();
import verifyWebhook from '../../services/middleware/verifyWebhook';

shopRedact.post('/gdpr/shop_redact', bodyParser(), verifyWebhook(), async (ctx) => {
  console.log('Shop Redact endpoint was hit.');
  console.log(ctx.request.body);
  ctx.response.body = { response: 'Shop Redact Request was received by server.' };
});

export default shopRedact;
