// to populate the fields again:
/* 
fieldsSourceData.<category>.reduce((accum, current) => {
  accum[current.value] = false;
  return accum;
}, {}) 
*/
export const initialFieldsState = {
  main: {
    name: false,
    buyer_accepts_marketing: false,
    closed_at: false,
    processed_at: false,
    currency: false,
    total_discounts: false,
    email: false,
    financial_status: false,
    fulfillment_status: false,
    location_id: false,
    note_attributes: false,
    note: false,
    phone: false,
    referring_site: false,
    tags: false,
    total_tax: false,
    taxes_included: false,
    total_weight: false,
  },
  customer: {
    customer__email: false,
    customer__first_name: false,
    customer__last_name: false,
    customer__phone: false,
    customer__note: false,
  },
  lineItems: {
    line_items__title: false,
    line_items__price: false,
    line_items__quantity: false,
    line_items__fulfillment_status: false,
    line_items__fulfillable_quantity: false,
    line_items__fulfillment_service: false,
    line_items__sku: false,
    line_items__grams: false,
    line_items__product_id: false,
    line_items__requires_shipping: false,
    line_items__variant_id: false,
    line_items__variant_title: false,
    line_items__vendor: false,
    line_items__gift_card: false,
    line_items__taxable: false,
    line_items__total_discount: false,
    line_items__properties: false,
  },
  transactions: {
    transactions__amount: false,
    transactions__gateway: false,
    transactions__status: false,
    transactions__kind: false,
    transactions__currency: false,
    transactions__processed_at: false,
  },
  billingAddress: {
    billing_address__first_name: false,
    billing_address__last_name: false,
    billing_address__address1: false,
    billing_address__city: false,
    billing_address__zip: false,
    billing_address__country: false,
    billing_address__province: false,
    billing_address__name: false,
    billing_address__address2: false,
    billing_address__company: false,
    billing_address__phone: false,
    billing_address__province_code: false,
    billing_address__country_code: false,
  },
  discountCodes: {
    discount_codes__amount: false,
    discount_codes__code: false,
    discount_codes__type: false,
  },
  shippingAddress: {
    shipping_address__first_name: false,
    shipping_address__last_name: false,
    shipping_address__address1: false,
    shipping_address__city: false,
    shipping_address__zip: false,
    shipping_address__country: false,
    shipping_address__province: false,
    shipping_address__name: false,
    shipping_address__address2: false,
    shipping_address__company: false,
    shipping_address__latitude: false,
    shipping_address__longitude: false,
    shipping_address__phone: false,
    shipping_address__country_code: false,
    shipping_address__province_code: false,
  },
  shippingLines: {
    shipping_lines__code: false,
    shipping_lines__discounted_price: false,
    shipping_lines__price: false,
    shipping_lines__source: false,
    shipping_lines__title: false,
    shipping_lines__carrier_identifier: false,
    shipping_lines__requested_fulfillment_service_id: false,
  },
  taxLines: {
    tax_lines__price: false,
    tax_lines__rate: false,
    tax_lines__title: false,
    tax_lines__channel_liable: false,
  },
  fulfillments: {
    fulfillments__tracking_company: false,
    fulfillments__tracking_numbers: false,
    fulfillments__tracking_urls: false,
  },
  fulfillmentOrders: {
    fulfillment_orders__id: false,
    fulfillment_orders__assigned_location_id: false,
    fulfillment_orders__status: false,
  },
};
