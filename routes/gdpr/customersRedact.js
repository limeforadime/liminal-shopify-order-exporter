/*
Payload
{
  shop_id: 954889,
  shop_domain: "snowdevil.myshopify.com",
  customer: {
    id: 191167,
    email: "john@email.com",
    phone: "555-625-1199",
  },
  orders_to_redact: [299938, 280263, 220458],
};
*/
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
const customersRedact = new Router();
import verifyWebhook from '../../utils/server/middleware/verifyWebhook';

customersRedact.post('/gdpr/customers_redact', bodyParser(), verifyWebhook(), async (ctx) => {
  console.log('Customer Redact Request endpoint was hit.');
  console.log(ctx.request.body);
  ctx.response.body = { response: 'Customer Redact Request was received by server.' };
});

export default customersRedact;
