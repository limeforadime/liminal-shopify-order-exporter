export const getFulfillments = async ({ orderId, client } = {}) => {
  const fulfillments = await client.get({
    path: `orders/${orderId}/fulfillments`,
  });
  return fulfillments.body.fulfillments;
};
