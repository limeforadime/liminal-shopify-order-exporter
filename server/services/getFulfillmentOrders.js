export const getFulfillmentOrders = async ({ orderId, client } = {}) => {
  const fulfillmentOrders = await client.get({
    path: `orders/${orderId}/fulfillment_orders`,
  });
  return fulfillmentOrders.body.fulfillment_orders;
};
