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
import convertTagsToQueryString from 'utils/client/convertTagsToQueryString';
import moment from 'moment';
const saveExportToDB = new Router();

// UPDATE 3/7/2022 11:06pm
// Just realized instead of having the client send data over about their selected fields/tags/whatnot,
// I can just get it from the database, and the front end can be centered
// entirely around editing and saving their profile.
/*
 */
// SCRATCH PAD -- Things that need to happen
/*
1) Need to get info on what the user wants to filter and which fields they want
2) Need to get orders
3) For each order, if the user asked, must get transaction, fulfillment, and fulfillmentOrder info and stick
   it back onto that given order
4) Need to check if user wants column names to be verbose, or human readable
5) Must flatten the array of orders
6) Must convert that flattened array into the actual CSV file
7) Some way, some how, must get that CSV file to the user. 
8) Store the file in mongodb, but maybe just for about a day
*/

// Actual planned steps for this route
/*
1) Read profile's ID and fetch profile data from MongoDB
2) Once fetched, run all the conversion methods that used to be on front end, read: above steps
3) Save that csv file to mongodb for a day.
*/

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
  const fields = ['id'];
  if (Object.values(checkedMainState).some((val) => val == true)) {
    fieldsSourceData.main.forEach(({ value }, index) => {
      if (Object.values(checkedMainState)[index] == true) fields.push(value);
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
const fetchOrders = async (profile) => {};
const appendDataToOrders = async (profile) => {
  // const { checkedTransactionsState, checkedFulfillmentsState, checkedFulfillmentOrdersState } =
  // profile.settings.fields;
  // try {
  // let fetchedOrders = await fetchOrders(profile);
  // if (fetchedOrders?.length > 0) {
  // for (let order of fetchedOrders) {
  // // Must fetch transactions, fulfillments, and fulfillmentOrders for each order, and batch the call with Promise.all
  // let promises = [];
  // if (Object.values(checkedTransactionsState).some((val) => val == true)) {
  // promises.push(userLoggedInFetch(app)(`${app.localOrigin}/api/transactions?orderId=${order.id}`));
  // }
  // if (Object.values(checkedFulfillmentsState).some((val) => val == true)) {
  // promises.push(userLoggedInFetch(app)(`${app.localOrigin}/api/fulfillments?orderId=${order.id}`));
  // }
  // if (Object.values(checkedFulfillmentOrdersState).some((val) => val == true)) {
  // promises.push(userLoggedInFetch(app)(`${app.localOrigin}/api/fulfillment_orders?orderId=${order.id}`));
  // }
  // if (promises.length > 0) {
  // const resolvedPromises = await Promise.all(promises);
  // const [transactionsData, fulfillmentsData, fulfillmentOrdersData] = resolvedPromises.map(
  // async (promise) => {
  // const res = await promise.json();
  // return res;
  // }
  // );
  // transactionsData && (order.transactions = await transactionsData);
  // fulfillmentsData && (order.fulfillments = await fulfillmentsData);
  // fulfillmentOrdersData && (order.filfillmentOrders = await fulfillmentOrdersData);
  // }
  // }
  // console.log(fetchedOrders);
  // return fetchedOrders;
  // } else {
  // throw new Error('Could not retrieve fetchedOrders');
  // }
  // } catch (err) {
  // console.log(err);
  // }
};
const parseParamsToObject = (querystring) => {
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
    let fetchedOrders = null;
    const client = await getShopifyClient(ctx);

    const profile = await ProfileModel.findById(id);
    const { checkedTransactionsState, checkedFulfillmentsState, checkedFulfillmentOrdersState } =
      profile.settings.fields;

    const { selectedTags } = profile.settings;
    let fields = buildFieldsToRestrictDataBy(profile);
    const formattedSelectedTags = convertTagsToQueryString(selectedTags, moment, allStatusChoices);
    const selectedTagsBackToObject = parseParamsToObject(formattedSelectedTags);

    // TODO: Refactor into service, getOrders or something
    const res = await client.get({
      path: 'orders',
      query: { ...selectedTagsBackToObject, fields: fields.join(',') },
    });
    fetchedOrders = res.body.orders;
    console.log(fetchedOrders);
    if (fetchedOrders?.length > 0) {
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
        }
      } // end for loop
      console.log(fetchedOrders);
      ctx.body = fetchedOrders;
      return fetchedOrders;
    } else {
      throw new Error('Could not retrieve fetchedOrders');
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, 'Server thrown error inside saveExportToDB route');
  }
});

export default saveExportToDB;
