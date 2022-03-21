export const getTransactions = async ({ orderId, client } = {}) => {
  const transactions = await client.get({
    path: `orders/${orderId}/transactions`,
  });
  return transactions.body.transactions;
};
