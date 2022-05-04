import flatten from 'flat';
import { fieldsSourceData } from 'components/Fields/data/fieldsData';
import { getPreparedOrderDataForCSV, exportsForTests } from 'server/services/getPreparedOrderDataForCSV';
const {
  filterAndConvertArrayToPlainEnglish,
  filterAndConvertObjectToPlainEnglish,
  filterUsingCheckedFields,
  flattenEachFieldWithGroupName,
  getGroupNameInPlainEnglish,
  convertObjectToPlainEnglish,
  convertObjectToPlainEnglishOnlyMain,
  getFieldInPlainEnglish,
  getFieldInPlainEnglishOnlyForMain,
} = exportsForTests;

// #region source data
const apiData = {
  id: 4383754682522,
  buyer_accepts_marketing: false,
  closed_at: null,
  currency: 'USD',
  discount_codes: [
    {
      code: 'SPRING30',
      type: 'fixed_amount',
      amount: '30.00',
    },
    {
      code: 'FUUUUU',
      type: 'fixed_amount',
      amount: '69.42',
    },
  ],
  email: '',
  financial_status: 'paid',
  fulfillment_status: null,
  location_id: 47856484506,
  name: '#1010',
  note: null,
  note_attributes: [
    {
      name: 'custom name',
      value: 'custom value',
    },
  ],
  phone: null,
  processed_at: '2022-03-07T04:07:05-05:00',
  referring_site: null,
  tags: '',
  tax_lines: [
    {
      rate: 0.06,
      price: 11.94,
      title: 'State Tax',
      channel_liable: true,
    },
  ],
  taxes_included: false,
  total_discounts: '0.00',
  total_tax: '0.00',
  total_weight: 0,
  billing_address: {
    first_name: 'asdf',
    address1: '123456 Main Street',
    phone: '555-555-5555',
    city: 'Longwood',
    zip: '90234',
    province: 'California',
    country: 'United States',
    last_name: 'fffffff',
    address2: '',
    company: null,
    latitude: null,
    longitude: null,
    name: 'asdf fffffff',
    country_code: 'US',
    province_code: 'CA',
  },
  customer: {
    id: 6029906378906,
    email: null,
    accepts_marketing: false,
    created_at: '2022-03-07T04:07:04-05:00',
    updated_at: '2022-03-07T04:07:07-05:00',
    first_name: 'asdf',
    last_name: 'fffffff',
    orders_count: 0,
    state: 'disabled',
    total_spent: '0.00',
    last_order_id: null,
    note: null,
    verified_email: true,
    multipass_identifier: null,
    tax_exempt: false,
    phone: null,
    tags: '',
    last_order_name: null,
    currency: 'USD',
    accepts_marketing_updated_at: '2022-03-07T04:07:07-05:00',
    marketing_opt_in_level: null,
    tax_exemptions: [],
    sms_marketing_consent: null,
    admin_graphql_api_id: 'gid://shopify/Customer/6029906378906',
    default_address: {
      id: 7135327813786,
      customer_id: 6029906378906,
      first_name: 'asdf',
      last_name: 'fffffff',
      company: null,
      address1: '123456 Main Street',
      address2: '',
      city: 'Longwood',
      province: 'California',
      country: 'United States',
      zip: '90234',
      phone: '555-555-5555',
      name: 'asdf fffffff',
      province_code: 'CA',
      country_code: 'US',
      country_name: 'United States',
      default: true,
    },
  },
  line_items: [
    {
      id: 10971876622490,
      admin_graphql_api_id: 'gid://shopify/LineItem/10971876622490',
      fulfillable_quantity: 1,
      fulfillment_service: 'manual',
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      name: 'asdfasdf',
      origin_location: {
        id: 2688445743258,
        country_code: 'US',
        province_code: 'CA',
        name: '123456 Main Street',
        address1: '123456 Main Street',
        address2: '',
        city: 'Longwood',
        zip: '12345',
      },
      price: '24.06',
      price_set: {
        shop_money: {
          amount: '24.06',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '24.06',
          currency_code: 'USD',
        },
      },
      product_exists: true,
      product_id: 6016188383386,
      properties: [{ name: 'wuddup', value: 'thevalue' }],
      quantity: 1,
      requires_shipping: true,
      sku: '',
      taxable: true,
      title: 'asdfasdf',
      total_discount: '0.00',
      total_discount_set: {
        shop_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
      },
      variant_id: 37360064725146,
      variant_inventory_management: 'shopify',
      variant_title: '',
      vendor: 'Test Store Testing Testing Wuddup',
      tax_lines: [],
      duties: [],
      discount_allocations: [],
    },
    {
      id: 10971876655258,
      admin_graphql_api_id: 'gid://shopify/LineItem/10971876655258',
      fulfillable_quantity: 1,
      fulfillment_service: 'manual',
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      name: 'broken voice',
      origin_location: {
        id: 2688445743258,
        country_code: 'US',
        province_code: 'CA',
        name: '123456 Main Street',
        address1: '123456 Main Street',
        address2: '',
        city: 'Longwood',
        zip: '12345',
      },
      price: '7.00',
      price_set: {
        shop_money: {
          amount: '7.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '7.00',
          currency_code: 'USD',
        },
      },
      product_exists: true,
      product_id: 5842311446682,
      properties: [],
      quantity: 1,
      requires_shipping: true,
      sku: '',
      taxable: true,
      title: 'broken voice',
      total_discount: '0.00',
      total_discount_set: {
        shop_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
      },
      variant_id: 36735665242266,
      variant_inventory_management: null,
      variant_title: '',
      vendor: 'Test Store Testing Testing Wuddup',
      tax_lines: [],
      duties: [],
      discount_allocations: [],
    },
    {
      id: 10971876688026,
      admin_graphql_api_id: 'gid://shopify/LineItem/10971876688026',
      fulfillable_quantity: 1,
      fulfillment_service: 'manual',
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      name: 'fffffffffffff',
      origin_location: {
        id: 2688445743258,
        country_code: 'US',
        province_code: 'CA',
        name: '123456 Main Street',
        address1: '123456 Main Street',
        address2: '',
        city: 'Longwood',
        zip: '12345',
      },
      price: '3.00',
      price_set: {
        shop_money: {
          amount: '3.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '3.00',
          currency_code: 'USD',
        },
      },
      product_exists: false,
      product_id: null,
      properties: [],
      quantity: 1,
      requires_shipping: false,
      sku: null,
      taxable: true,
      title: 'fffffffffffff',
      total_discount: '0.00',
      total_discount_set: {
        shop_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
      },
      variant_id: null,
      variant_inventory_management: null,
      variant_title: '',
      vendor: null,
      tax_lines: [],
      duties: [],
      discount_allocations: [],
    },
  ],
  shipping_lines: [
    {
      code: 'INT.TP',
      price: '4.00',
      title: 'Small Packet International Air',
      source: 'canada_post',
      discounted_price: '4.00',
      carrier_identifier: 'third_party_carrier_identifier',
      requested_fulfillment_service_id: 'third_party_fulfillment_service_id',
    },
  ],
  shipping_address: {
    zip: 'K2P0V6',
    city: 'Ottawa',
    name: 'Bob Bobsen',
    phone: '555-625-1199',
    company: null,
    country: 'Canada',
    address1: '123 Amoebobacterieae St',
    address2: '',
    latitude: '45.41634',
    province: 'Ontario',
    last_name: 'Bobsen',
    longitude: '-75.6868',
    first_name: 'Bob',
    country_code: 'CA',
    province_code: 'ON',
  },
  transactions: [
    {
      id: 5383544602778,
      order_id: 4383754682522,
      kind: 'sale',
      gateway: 'bogus',
      status: 'success',
      processed_at: '2022-03-07T04:07:05-05:00',
      amount: '34.06',
      currency: 'USD',
    },
  ],
  fulfillments: [
    {
      tracking_company: 'China Post',
      tracking_numbers: ['112345Z2345'],
      tracking_urls: ['http://track-chinapost.com/startairmail.php?code=112345Z2345'],
    },
    {
      tracking_company: 'TEST Post',
      tracking_numbers: ['asdfasdf12345'],
      tracking_urls: ['http://track-chinapost.com/startairmail.php?code=ffffffffffff'],
    },
  ],
  fulfillment_orders: [
    {
      id: 1046000777,
      assigned_location_id: 31,
      status: 'open',
    },
  ],
};
const checkedFieldsFromDatabase = {
  checkedCustomerState: {
    customer__email: true,
    customer__first_name: true,
    customer__last_name: true,
    customer__phone: true,
    customer__note: true,
  },
  checkedLineItemsState: {
    line_items__title: true,
    line_items__price: true,
    line_items__quantity: true,
    line_items__fulfillment_status: true,
    line_items__fulfillable_quantity: true,
    line_items__fulfillment_service: true,
    line_items__sku: true,
    line_items__grams: true,
    line_items__product_id: true,
    line_items__requires_shipping: true,
    line_items__variant_id: true,
    line_items__variant_title: true,
    line_items__vendor: true,
    line_items__gift_card: true,
    line_items__taxable: true,
    line_items__total_discount: true,
    line_items__properties: true,
  },
  checkedTransactionsState: {
    transactions__amount: true,
    transactions__gateway: true,
    transactions__status: true,
    transactions__kind: true,
    transactions__currency: true,
    transactions__processed_at: true,
  },
  checkedBillingAddressState: {
    billing_address__first_name: true,
    billing_address__last_name: true,
    billing_address__address1: true,
    billing_address__city: true,
    billing_address__zip: true,
    billing_address__country: true,
    billing_address__province: true,
    billing_address__name: true,
    billing_address__address2: true,
    billing_address__company: true,
    billing_address__phone: true,
    billing_address__province_code: true,
    billing_address__country_code: true,
  },
  checkedDiscountCodesState: {
    discount_codes__amount: true,
    discount_codes__code: true,
    discount_codes__type: true,
  },
  checkedShippingAddressState: {
    shipping_address__first_name: true,
    shipping_address__last_name: true,
    shipping_address__address1: true,
    shipping_address__city: true,
    shipping_address__zip: true,
    shipping_address__country: true,
    shipping_address__province: true,
    shipping_address__name: true,
    shipping_address__address2: true,
    shipping_address__company: true,
    shipping_address__latitude: true,
    shipping_address__longitude: true,
    shipping_address__phone: true,
    shipping_address__country_code: true,
    shipping_address__province_code: true,
  },
  checkedShippingLinesState: {
    shipping_lines__code: true,
    shipping_lines__discounted_price: true,
    shipping_lines__price: true,
    shipping_lines__source: true,
    shipping_lines__title: true,
    shipping_lines__carrier_identifier: true,
    shipping_lines__requested_fulfillment_service_id: true,
  },
  checkedTaxLinesState: {
    tax_lines__price: true,
    tax_lines__rate: true,
    tax_lines__title: true,
    tax_lines__channel_liable: true,
  },
  checkedFulfillmentsState: {
    fulfillments__tracking_company: true,
    fulfillments__tracking_numbers: true,
    fulfillments__tracking_urls: true,
  },
  checkedFulfillmentOrdersState: {
    fulfillment_orders__id: true,
    fulfillment_orders__assigned_location_id: true,
    fulfillment_orders__status: true,
  },
};
// #endregion

describe('Main test for getPreparedOrderDataForCSV', () => {
  it('Should convert the order object correctly', () => {
    expect(getPreparedOrderDataForCSV(apiData, checkedFieldsFromDatabase)).toEqual({
      'Buyer Accepts Marketing': false,
      'Closed at': null,
      Currency: 'USD',
      Email: '',
      'Financial Status': 'paid',
      'Fulfillment Status': null,
      'Location Id': 47856484506,
      'Order name': '#1010',
      Notes: null,
      'Note Attributes/0/name': 'custom name',
      'Note Attributes/0/value': 'custom value',
      Phone: null,
      'Created at': '2022-03-07T04:07:05-05:00',
      'Referring Site': null,
      Tags: '',
      'Taxes Included': false,
      'Discount Amount': '0.00',
      Taxes: '0.00',
      'Total Weight': 0,
      'Customer Email': null,
      'Customer First Name': 'asdf',
      'Customer Last Name': 'fffffff',
      'Customer Phone': null,
      'Customer Note': null,
      'Line Items/0/Line Item Name': 'asdfasdf',
      'Line Items/0/Line Item Price': '24.06',
      'Line Items/0/Line Item Quantity': 1,
      'Line Items/0/Line Item Fulfillment Status': null,
      'Line Items/0/Line Item Fulfillable Quantity': 1,
      'Line Items/0/Line Item Fulfillment Service': 'manual',
      'Line Items/0/Line Item Sku': '',
      'Line Items/0/Line Item Grams': 0,
      'Line Items/0/Line Item Product ID': 6016188383386,
      'Line Items/0/Line Item Requires Shipping': true,
      'Line Items/0/Line Item Variant ID': 37360064725146,
      'Line Items/0/Line Item Variant Title': '',
      'Line Items/0/Vendor': 'Test Store Testing Testing Wuddup',
      'Line Items/0/Line Item Gift Card': false,
      'Line Items/0/Line Item Taxable': true,
      'Line Items/0/Line Item Discount': '0.00',
      'Line Items/0/Line Item Properties/0/name': 'wuddup',
      'Line Items/0/Line Item Properties/0/value': 'thevalue',
      'Line Items/1/Line Item Name': 'broken voice',
      'Line Items/1/Line Item Price': '7.00',
      'Line Items/1/Line Item Quantity': 1,
      'Line Items/1/Line Item Fulfillment Status': null,
      'Line Items/1/Line Item Fulfillable Quantity': 1,
      'Line Items/1/Line Item Fulfillment Service': 'manual',
      'Line Items/1/Line Item Sku': '',
      'Line Items/1/Line Item Grams': 0,
      'Line Items/1/Line Item Product ID': 5842311446682,
      'Line Items/1/Line Item Requires Shipping': true,
      'Line Items/1/Line Item Variant ID': 36735665242266,
      'Line Items/1/Line Item Variant Title': '',
      'Line Items/1/Vendor': 'Test Store Testing Testing Wuddup',
      'Line Items/1/Line Item Gift Card': false,
      'Line Items/1/Line Item Taxable': true,
      'Line Items/1/Line Item Discount': '0.00',
      'Line Items/1/Line Item Properties': [],
      'Line Items/2/Line Item Name': 'fffffffffffff',
      'Line Items/2/Line Item Price': '3.00',
      'Line Items/2/Line Item Quantity': 1,
      'Line Items/2/Line Item Fulfillment Status': null,
      'Line Items/2/Line Item Fulfillable Quantity': 1,
      'Line Items/2/Line Item Fulfillment Service': 'manual',
      'Line Items/2/Line Item Sku': null,
      'Line Items/2/Line Item Grams': 0,
      'Line Items/2/Line Item Product ID': null,
      'Line Items/2/Line Item Requires Shipping': false,
      'Line Items/2/Line Item Variant ID': null,
      'Line Items/2/Line Item Variant Title': '',
      'Line Items/2/Vendor': null,
      'Line Items/2/Line Item Gift Card': false,
      'Line Items/2/Line Item Taxable': true,
      'Line Items/2/Line Item Discount': '0.00',
      'Line Items/2/Line Item Properties': [],
      'Transactions/0/Total': '34.06',
      'Transactions/0/Payment Method': 'bogus',
      'Transactions/0/Transaction Status': 'success',
      'Transactions/0/Transaction Kind': 'sale',
      'Transactions/0/Transaction Currency': 'USD',
      'Transactions/0/Paid At': '2022-03-07T04:07:05-05:00',
      'Billing First Name': 'asdf',
      'Billing Last Name': 'fffffff',
      'Billing Address1': '123456 Main Street',
      'Billing City': 'Longwood',
      'Billing Zip': '90234',
      'Billing Country': 'United States',
      'Billing Province': 'California',
      'Billing Name': 'asdf fffffff',
      'Billing Address2': '',
      'Billing Company': null,
      'Billing Phone': '555-555-5555',
      'Billing Province Code': 'CA',
      'Billing Country Code': 'US',
      'Discount Codes/0/Discount Amount': '30.00',
      'Discount Codes/0/Discount Code': 'SPRING30',
      'Discount Codes/0/Discount Type': 'fixed_amount',
      'Discount Codes/1/Discount Amount': '69.42',
      'Discount Codes/1/Discount Code': 'FUUUUU',
      'Discount Codes/1/Discount Type': 'fixed_amount',
      'Shipping First Name': 'Bob',
      'Shipping Last Name': 'Bobsen',
      'Shipping Address1': '123 Amoebobacterieae St',
      'Shipping City': 'Ottawa',
      'Shipping Zip': 'K2P0V6',
      'Shipping Country': 'Canada',
      'Shipping Province': 'Ontario',
      'Shipping Name': 'Bob Bobsen',
      'Shipping Address2': '',
      'Shipping Company': null,
      'Shipping Latitude': '45.41634',
      'Shipping Longitude': '-75.6868',
      'Shipping Phone': '555-625-1199',
      'Shipping Country Code': 'CA',
      'Shipping Province Code': 'ON',
      'Shipping Lines/0/Shipping Method Code': 'INT.TP',
      'Shipping Lines/0/Shipping Discounted Price': '4.00',
      'Shipping Lines/0/Shipping Price': '4.00',
      'Shipping Lines/0/Shipping Method Source': 'canada_post',
      'Shipping Lines/0/Shipping Method': 'Small Packet International Air',
      'Shipping Lines/0/Shipping Carrier Identifier': 'third_party_carrier_identifier',
      'Shipping Lines/0/Shipping Requested Fulfillment Service Id': 'third_party_fulfillment_service_id',
      'Tax Lines/0/Tax Line Value': 11.94,
      'Tax Lines/0/Tax Line Rate': 0.06,
      'Tax Lines/0/Tax Line Name': 'State Tax',
      'Tax Lines/0/Tax Line Channel Liable': true,
      'Fulfillments/0/Tracking Company': 'China Post',
      'Fulfillments/0/Tracking Numbers/0': '112345Z2345',
      'Fulfillments/0/Tracking URLs/0': 'http://track-chinapost.com/startairmail.php?code=112345Z2345',
      'Fulfillments/1/Tracking Company': 'TEST Post',
      'Fulfillments/1/Tracking Numbers/0': 'asdfasdf12345',
      'Fulfillments/1/Tracking URLs/0': 'http://track-chinapost.com/startairmail.php?code=ffffffffffff',
      'Fulfillment Orders/0/Id': 1046000777,
      'Fulfillment Orders/0/Location Id': 31,
      'Fulfillment Orders/0/Status': 'open',
    });
  });
});

describe('Tests for filtering', () => {
  describe('filterUsingCheckedFields()', () => {
    let checkedCustomerStateTestData = { ...checkedFieldsFromDatabase.checkedCustomerState };
    checkedCustomerStateTestData = {
      ...checkedCustomerStateTestData,
      customer__last_name: false,
      customer__note: false,
    };
    let flattenedObject = {
      customer__email: 'bob.norman@mail.example.com',
      customer__phone: '+13125551212',
      customer__last_name: 'Norman',
      customer__first_name: 'Bob',
      customer__note: null,
    };
    let expected = {
      customer__email: 'bob.norman@mail.example.com',
      customer__first_name: 'Bob',
      customer__phone: '+13125551212',
    };
    it('Should filter correctly when given an object to filter by', () => {
      expect(filterUsingCheckedFields(checkedCustomerStateTestData, flattenedObject)).toEqual(expected);
    });
  });
  describe('filterAndConvertObjectToPlainEnglish()', () => {
    it('Should return the correct filtered, flattened, and plain-english-converted result', () => {
      let filteredCustomerObject = {
        ...checkedFieldsFromDatabase.checkedCustomerState,
        customer__email: false,
        customer__phone: false,
      };
      expect(
        filterAndConvertObjectToPlainEnglish(
          apiData.customer,
          'customer',
          checkedFieldsFromDatabase.checkedCustomerState
        )
      ).toEqual({
        'Customer Email': null,
        'Customer First Name': 'asdf',
        'Customer Last Name': 'fffffff',
        'Customer Phone': null,
        'Customer Note': null,
      });
      expect(filterAndConvertObjectToPlainEnglish(apiData.customer, 'customer', filteredCustomerObject)).toEqual({
        'Customer First Name': 'asdf',
        'Customer Last Name': 'fffffff',
        'Customer Note': null,
      });
      expect(
        filterAndConvertObjectToPlainEnglish(
          apiData.line_items[0],
          'line_items',
          checkedFieldsFromDatabase.checkedLineItemsState
        )
      ).toEqual({
        'Line Item Name': 'asdfasdf',
        'Line Item Price': '24.06',
        'Line Item Quantity': 1,
        'Line Item Fulfillment Status': null,
        'Line Item Fulfillable Quantity': 1,
        'Line Item Fulfillment Service': 'manual',
        'Line Item Sku': '',
        'Line Item Grams': 0,
        'Line Item Product ID': 6016188383386,
        'Line Item Requires Shipping': true,
        'Line Item Variant ID': 37360064725146,
        'Line Item Variant Title': '',
        Vendor: 'Test Store Testing Testing Wuddup',
        'Line Item Gift Card': false,
        'Line Item Taxable': true,
        'Line Item Discount': '0.00',
        'Line Item Properties': [{ name: 'wuddup', value: 'thevalue' }],
      });
    });
  });
  describe('filterAndConvertArrayToPlainEnglish()', () => {
    it('Should return the correct filtered, flattened, and plain-english-converted result', () => {
      expect(
        filterAndConvertArrayToPlainEnglish(
          apiData.line_items,
          'line_items',
          checkedFieldsFromDatabase.checkedLineItemsState
        )
      ).toEqual({
        'Line Items/0/Line Item Name': 'asdfasdf',
        'Line Items/0/Line Item Price': '24.06',
        'Line Items/0/Line Item Quantity': 1,
        'Line Items/0/Line Item Fulfillment Status': null,
        'Line Items/0/Line Item Fulfillable Quantity': 1,
        'Line Items/0/Line Item Fulfillment Service': 'manual',
        'Line Items/0/Line Item Sku': '',
        'Line Items/0/Line Item Grams': 0,
        'Line Items/0/Line Item Product ID': 6016188383386,
        'Line Items/0/Line Item Requires Shipping': true,
        'Line Items/0/Line Item Variant ID': 37360064725146,
        'Line Items/0/Line Item Variant Title': '',
        'Line Items/0/Vendor': 'Test Store Testing Testing Wuddup',
        'Line Items/0/Line Item Gift Card': false,
        'Line Items/0/Line Item Taxable': true,
        'Line Items/0/Line Item Discount': '0.00',
        'Line Items/0/Line Item Properties/0/name': 'wuddup',
        'Line Items/0/Line Item Properties/0/value': 'thevalue',
        'Line Items/1/Line Item Name': 'broken voice',
        'Line Items/1/Line Item Price': '7.00',
        'Line Items/1/Line Item Quantity': 1,
        'Line Items/1/Line Item Fulfillment Status': null,
        'Line Items/1/Line Item Fulfillable Quantity': 1,
        'Line Items/1/Line Item Fulfillment Service': 'manual',
        'Line Items/1/Line Item Sku': '',
        'Line Items/1/Line Item Grams': 0,
        'Line Items/1/Line Item Product ID': 5842311446682,
        'Line Items/1/Line Item Requires Shipping': true,
        'Line Items/1/Line Item Variant ID': 36735665242266,
        'Line Items/1/Line Item Variant Title': '',
        'Line Items/1/Vendor': 'Test Store Testing Testing Wuddup',
        'Line Items/1/Line Item Gift Card': false,
        'Line Items/1/Line Item Taxable': true,
        'Line Items/1/Line Item Discount': '0.00',
        'Line Items/1/Line Item Properties': [],
        'Line Items/2/Line Item Name': 'fffffffffffff',
        'Line Items/2/Line Item Price': '3.00',
        'Line Items/2/Line Item Quantity': 1,
        'Line Items/2/Line Item Fulfillment Status': null,
        'Line Items/2/Line Item Fulfillable Quantity': 1,
        'Line Items/2/Line Item Fulfillment Service': 'manual',
        'Line Items/2/Line Item Sku': null,
        'Line Items/2/Line Item Grams': 0,
        'Line Items/2/Line Item Product ID': null,
        'Line Items/2/Line Item Requires Shipping': false,
        'Line Items/2/Line Item Variant ID': null,
        'Line Items/2/Line Item Variant Title': '',
        'Line Items/2/Vendor': null,
        'Line Items/2/Line Item Gift Card': false,
        'Line Items/2/Line Item Taxable': true,
        'Line Items/2/Line Item Discount': '0.00',
        'Line Items/2/Line Item Properties': [],
      });
    });
  });
});

it('getGroupNameInPlainEnglish()', () => {
  expect(getGroupNameInPlainEnglish('customer')).toEqual('Customer');
  expect(getGroupNameInPlainEnglish('line_items')).toEqual('Line Items');
  expect(getGroupNameInPlainEnglish('billing_address')).toEqual('Billing Address');
  expect(getGroupNameInPlainEnglish('fulfillment_orders')).toEqual('Fulfillment Orders');
  expect(getGroupNameInPlainEnglish('shipping_lines')).toEqual('Shipping Lines');
});

it('getFieldInPlainEnglish()', () => {
  expect(getFieldInPlainEnglish(fieldsSourceData, 'customer', 'customer__first_name')).toEqual(
    'Customer First Name'
  );
  expect(getFieldInPlainEnglish(fieldsSourceData, 'line_items', 'line_items__price')).toEqual('Line Item Price');
});

it('getFieldInPlainEnglishOnlyForMain()', () => {
  expect(getFieldInPlainEnglishOnlyForMain(fieldsSourceData.main, 'buyer_accepts_marketing')).toEqual(
    'Buyer Accepts Marketing'
  );
  expect(getFieldInPlainEnglishOnlyForMain(fieldsSourceData.main, 'total_discounts')).toEqual('Discount Amount');
});

it('convertObjectToPlainEnglish()', () => {
  const testFilteredCustomerObject = {
    customer__email: 'bob.norman@mail.example.com',
    customer__first_name: 'Bob',
  };
  const expected = {
    'Customer Email': 'bob.norman@mail.example.com',
    'Customer First Name': 'Bob',
  };
  expect(convertObjectToPlainEnglish(fieldsSourceData, testFilteredCustomerObject, 'customer')).toEqual(expected);
});

it('convertObjectToPlainEnglishOnlyMain()', () => {
  const testFilteredMainObject = {
    name: '#1005',
    buyer_accepts_marketing: true,
    closed_at: '2022-03-07T04:07:05-05:00',
    financial_status: 'paid',
  };
  const expected = {
    'Order name': '#1005',
    'Buyer Accepts Marketing': true,
    'Closed at': '2022-03-07T04:07:05-05:00',
    'Financial Status': 'paid',
  };
  expect(convertObjectToPlainEnglishOnlyMain(fieldsSourceData.main, testFilteredMainObject)).toEqual(expected);
});

it('flattenEachFieldWithGroupName()', () => {
  const customer = {
    email: null,
    first_name: 'asdf',
    last_name: 'fffffff',
    note: null,
    phone: null,
  };
  const expected = {
    customer__email: null,
    customer__first_name: 'asdf',
    customer__last_name: 'fffffff',
    customer__phone: null,
    customer__note: null,
  };
  expect(flattenEachFieldWithGroupName(customer, 'customer')).toEqual(expected);
});
// #region testingArea
// TESTING AREA
// ==========================================================
// let handledArray_LineItems = filterAndConvertArrayToPlainEnglish(apiData.line_items, 'line_items', {
//   line_items__title: true,
//   line_items__price: true,
//   line_items__quantity: true,
//   line_items__fulfillment_status: true,
//   line_items__fulfillable_quantity: true,
//   line_items__fulfillment_service: true,
//   line_items__sku: true,
//   line_items__grams: true,
//   line_items__product_id: true,
//   line_items__requires_shipping: true,
//   line_items__variant_id: true,
//   line_items__variant_title: true,
//   line_items__vendor: true,
//   line_items__gift_card: true,
//   line_items__taxable: true,
//   line_items__total_discount: true,
//   line_items__properties: true,
// });
// let handledArray_Transactions = filterAndConvertArrayToPlainEnglish(apiData.transactions, 'transactions', {
//   transactions__amount: true,
//   transactions__gateway: true,
//   transactions__status: true,
//   transactions__kind: true,
//   transactions__currency: true,
//   transactions__processed_at: true,
// });
// let handledArray_DiscountCodes = filterAndConvertArrayToPlainEnglish(apiData.discount_codes, 'discount_codes', {
//   discount_codes__amount: true,
//   discount_codes__code: true,
//   discount_codes__type: true,
// });
// let handledArray_ShippingLines = filterAndConvertArrayToPlainEnglish(apiData.shipping_lines, 'shipping_lines', {
//   shipping_lines__code: true,
//   shipping_lines__discounted_price: true,
//   shipping_lines__price: true,
//   shipping_lines__source: true,
//   shipping_lines__title: true,
//   shipping_lines__carrier_identifier: true,
//   shipping_lines__requested_fulfillment_service_id: true,
// });
// let handledArray_TaxLines = filterAndConvertArrayToPlainEnglish(apiData.tax_lines, 'tax_lines', {
//   tax_lines__price: true,
//   tax_lines__rate: true,
//   tax_lines__title: true,
//   tax_lines__channel_liable: true,
// });
// let handledArray_Fulfillments = filterAndConvertArrayToPlainEnglish(apiData.fulfillments, 'fulfillments', {
//   fulfillments__tracking_company: true,
//   fulfillments__tracking_numbers: true,
//   fulfillments__tracking_urls: true,
// });
// let handledArray_FulfillmentOrders = filterAndConvertArrayToPlainEnglish(
//   apiData.fulfillment_orders,
//   'fulfillment_orders',
//   {
//     fulfillment_orders__id: true,
//     fulfillment_orders__assigned_location_id: true,
//     fulfillment_orders__status: true,
//   }
// );
// console.log(handledArray_LineItems);
// console.log(handledArray_Transactions);
// console.log(handledArray_DiscountCodes);
// console.log(handledArray_ShippingLines);
// console.log(handledArray_TaxLines);
// console.log(handledArray_Fulfillments);
// console.log(handledArray_FulfillmentOrders);

// let handledObject_BillingAddress = filterAndConvertObjectToPlainEnglish(
//   apiData.billing_address,
//   'billing_address',
//   {
//     billing_address__first_name: true,
//     billing_address__address1: true,
//     billing_address__phone: true,
//     billing_address__city: true,
//     billing_address__zip: true,
//     billing_address__province: true,
//     billing_address__country: true,
//     billing_address__last_name: true,
//     billing_address__address2: true,
//     billing_address__company: true,
//     billing_address__latitude: true,
//     billing_address__longitude: true,
//     billing_address__name: true,
//     billing_address__country_code: true,
//     billing_address__province_code: true,
//   }
// );
// let handledObject_Customer = filterAndConvertObjectToPlainEnglish(apiData.customer, 'customer', {
//   customer__email: true,
//   customer__first_name: true,
//   customer__last_name: true,
//   customer__phone: true,
//   customer__note: true,
// });
// let handledObject_ShippingAddress = filterAndConvertObjectToPlainEnglish(
//   apiData.shipping_address,
//   'shipping_address',
//   {
//     shipping_address__first_name: true,
//     shipping_address__last_name: true,
//     shipping_address__address1: true,
//     shipping_address__city: true,
//     shipping_address__zip: true,
//     shipping_address__country: true,
//     shipping_address__province: true,
//     shipping_address__name: true,
//     shipping_address__address2: true,
//     shipping_address__company: true,
//     shipping_address__latitude: true,
//     shipping_address__longitude: true,
//     shipping_address__phone: true,
//     shipping_address__country_code: true,
//     shipping_address__province_code: true,
//   }
// );
// let handledObject_Main = filterAndConvertOnlyMain(getMainFields(apiData));

// console.log(handledObject_Main);
// console.log(handledObject_BillingAddress);
// console.log(handledObject_Customer);
// console.log(handledObject_ShippingAddress);
// #endregion
