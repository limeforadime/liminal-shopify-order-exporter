/*
Payload
{
  shop_id: 954889,
  shop_domain: "snowdevil.myshopify.com",
  orders_requested: [299938, 280263, 220458],
  customer: {
    id: 191167,
    email: "john@email.com",
    phone: "555-625-1199",
  },
  data_request: {
    id: 9999,
  },
};
*/
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
const customersDataRequest = new Router();
import verifyWebhook from '../../services/middleware/verifyWebhook';

customersDataRequest.post('/gdpr/customers_data_request', bodyParser(), verifyWebhook(), async (ctx) => {
  console.log('Customer Data Request endpoint was hit, and verified.');
  console.log('Payload from Shopify:');
  console.log(ctx.request.body);
  console.log('Customer data:');
  console.log(ctx.request.body.customer);
  ctx.response.body = { response: 'Customer Data Request was received by server.' };
});

export default customersDataRequest;
