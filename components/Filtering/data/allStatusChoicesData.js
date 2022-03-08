export const allStatusChoices = {
  paymentStatusChoices: [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Voided', value: 'voided' },
    { label: 'Pending', value: 'pending' },
    { label: 'Refunded', value: 'refunded' },
    { label: 'Authorized', value: 'authorized' },
    { label: 'Partially paid', value: 'partially_paid' },
    { label: 'Partially refunded', value: 'partially_refunded' },
  ],
  statusChoices: [
    { label: 'Open', value: 'open' },
    { label: 'Archived', value: 'closed' },
    { label: 'Cancelled', value: 'cancelled' },
  ],
  fulfillmentStatusChoices: [
    { label: 'Shipped', value: 'shipped' },
    { label: 'Partially fulfilled', value: 'partial' },
    { label: 'Unfulfilled', value: 'unfulfilled' },
  ],
};
