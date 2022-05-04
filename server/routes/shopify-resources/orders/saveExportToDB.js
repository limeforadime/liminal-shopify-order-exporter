import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { verifyRequest } from 'simple-koa-shopify-auth';
import ProfileModel from 'server/models/ProfileModel';
import { fieldsSourceData } from 'components/Fields/data/fieldsData';
import { allStatusChoices } from 'components/Filtering/data/allStatusChoicesData';
import { getShopifyClient } from 'server/services/getShopifyClient';
import { getTransactions } from 'server/services/getTransactions';
import { getFulfillments } from 'server/services/getFulfillments';
import { getFulfillmentOrders } from 'server/services/getFulfillmentOrders';
import { getPreparedOrderDataForCSV } from 'server/services/getPreparedOrderDataForCSV';
import convertTagsToQueryString from 'utils/convertTagsToQueryString';
import moment from 'moment';
const saveExportToDB = new Router();

/** @returns an array of fields in the form of `['id','phone','shipping_address']` etc. to limit the fields returned by the orders api. */
const buildFieldsToRestrictDataBy = (profile) => {
  const {
    checkedMainState,
    checkedCustomerState,
    checkedLineItemsState,
    checkedBillingAddressState,
    checkedDiscountCodesState,
    checkedShippingAddressState,
    checkedShippingLinesState,
    checkedTaxLinesState,
  } = profile.settings.fields;

  // TODO: Might consider making this line optional
  const fields = ['id'];
  if (Object.values(checkedMainState).some((val) => val == true)) {
    fieldsSourceData.main.forEach(({ value }, index) => {
      const currentMainStateOption = Object.values(checkedMainState)[index];
      if (currentMainStateOption == true) fields.push(value);
    });
  }
  if (Object.values(checkedCustomerState).some((val) => val == true)) fields.push('customer');
  if (Object.values(checkedLineItemsState).some((val) => val == true)) fields.push('line_items');
  if (Object.values(checkedBillingAddressState).some((val) => val == true)) fields.push('billing_address');
  if (Object.values(checkedDiscountCodesState).some((val) => val == true)) fields.push('discount_codes');
  if (Object.values(checkedShippingAddressState).some((val) => val == true)) fields.push('shipping_address');
  if (Object.values(checkedShippingLinesState).some((val) => val == true)) fields.push('shipping_lines');
  if (Object.values(checkedTaxLinesState).some((val) => val == true)) fields.push('tax_lines');
  return fields;
};

// Eg. '?s=myquery&x=3' ==> { s: 'myquery', x: 3 }
const parseParamsBackToObject = (querystring) => {
  const params = new URLSearchParams(querystring);
  const obj = {};
  // iterate over all keys
  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key);
    }
  }
  return obj;
};

saveExportToDB.post('/api/saveExportToDB', bodyParser(), verifyRequest({ returnHeader: true }), async (ctx) => {
  try {
    const { id } = ctx.request.body;
    let fetchedOrders;
    let ordersPreparedForCSVConversion = [];
    const client = await getShopifyClient(ctx);

    const profile = await ProfileModel.findById(id);
    // I am getting these separately because they each require their own fetch request from unique endpoints
    const { checkedTransactionsState, checkedFulfillmentsState, checkedFulfillmentOrdersState } =
      profile.settings.fields;

    const { selectedTags } = profile.settings;
    let fields = buildFieldsToRestrictDataBy(profile);
    const formattedSelectedTags = convertTagsToQueryString(selectedTags, moment, allStatusChoices);
    const selectedTagsBackToObject = parseParamsBackToObject(formattedSelectedTags);

    const res = await client.get({
      path: 'orders',
      query: { ...selectedTagsBackToObject, fields: fields.join(',') },
    });
    fetchedOrders = res.body.orders;
    if (fetchedOrders?.length == 0) {
      // TODO Handle this more gracefully
      throw new Error('Could not retrieve fetchedOrders');
    }
    for (let order of fetchedOrders) {
      // Must fetch transactions, fulfillments, and fulfillmentOrders for each order, and batch the call with Promise.all
      let promises = [];
      if (Object.values(checkedTransactionsState).some((val) => val == true)) {
        // promises.push(userLoggedInFetch(app)(`${app.localOrigin}/api/transactions?orderId=${order.id}`));
        promises.push(getTransactions({ orderId: order.id, client }));
      }
      if (Object.values(checkedFulfillmentsState).some((val) => val == true)) {
        // promises.push(userLoggedInFetch(app)(`${app.localOrigin}/api/fulfillments?orderId=${order.id}`));
        promises.push(getFulfillments({ orderId: order.id, client }));
      }
      if (Object.values(checkedFulfillmentOrdersState).some((val) => val == true)) {
        // promises.push(userLoggedInFetch(app)(`${app.localOrigin}/api/fulfillment_orders?orderId=${order.id}`));
        promises.push(getFulfillmentOrders({ orderId: order.id, client }));
      }
      if (promises.length > 0) {
        const resolvedPromises = await Promise.all(promises);
        const [transactionsData, fulfillmentsData, fulfillmentOrdersData] = resolvedPromises;
        transactionsData && (order.transactions = await transactionsData);
        fulfillmentsData && (order.fulfillments = await fulfillmentsData);
        fulfillmentOrdersData && (order.filfillmentOrders = await fulfillmentOrdersData);
        ordersPreparedForCSVConversion.push(getPreparedOrderDataForCSV(order, profile.settings.fields));
      }
    } // end for loop
    console.log(fetchedOrders);
    console.log(ordersPreparedForCSVConversion);
    ctx.body = ordersPreparedForCSVConversion;
    return fetchedOrders;
  } catch (err) {
    console.log(err);
    ctx.throw(500, 'Server thrown error inside saveExportToDB route');
  }
});

export default saveExportToDB;
