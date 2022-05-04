import flatten from 'flat';
import { fieldsSourceData } from 'components/Fields/data/fieldsData';
const exportsForTests = {
  filterAndConvertArrayToPlainEnglish,
  filterAndConvertObjectToPlainEnglish,
  flattenEachFieldWithGroupName,
  filterUsingCheckedFields,
  getGroupNameInPlainEnglish,
  convertObjectToPlainEnglish,
  convertObjectToPlainEnglishOnlyMain,
  getFieldInPlainEnglish,
  getFieldInPlainEnglishOnlyForMain,
};
export { getPreparedOrderDataForCSV, exportsForTests };

function getPreparedOrderDataForCSV(apiData, checkedFieldsFromDatabase) {
  // functions to separate "main" fields from the rest of the nested subgroups
  const getSubgroups = (apiData, groupsToInclude) => {
    const nestedFields = pick(apiData, groupsToInclude);
    return nestedFields;
  };
  const getMainFields = (apiData) => {
    const {
      customer,
      line_items,
      transactions,
      billing_address,
      discount_codes,
      shipping_address,
      shipping_lines,
      tax_lines,
      fulfillments,
      fulfillment_orders,
      ...onlyMainFields
    } = apiData;
    return onlyMainFields;
  };
  const {
    checkedCustomerState,
    checkedLineItemsState,
    checkedBillingAddressState,
    checkedDiscountCodesState,
    checkedShippingAddressState,
    checkedShippingLinesState,
    checkedTaxLinesState,
    checkedTransactionsState,
    checkedFulfillmentsState,
    checkedFulfillmentOrdersState,
  } = checkedFieldsFromDatabase;
  const groupNames = [
    'customer',
    'line_items',
    'transactions',
    'billing_address',
    'discount_codes',
    'shipping_address',
    'shipping_lines',
    'tax_lines',
    'fulfillments',
    'fulfillment_orders',
  ];
  let result = {};

  // split data by Main and The Rest
  const mainFields = getMainFields(apiData);
  const subgroups = getSubgroups(apiData, groupNames);

  // Handle main fields first
  // TODO handle if there were no main fields checked
  const transformedMainFields = convertObjectToPlainEnglishOnlyMain(fieldsSourceData.main, mainFields);
  result = { ...result, ...transformedMainFields };

  // Of The Rest, check if it's array or object, and use corresponding method for it
  for (const [groupName, value] of Object.entries(subgroups)) {
    switch (groupName) {
      case 'customer':
        result = { ...result, ...filterAndConvertObjectToPlainEnglish(value, groupName, checkedCustomerState) };
        break;
      case 'line_items':
        result = { ...result, ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedLineItemsState) };
        break;
      case 'transactions':
        result = { ...result, ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedTransactionsState) };
        break;
      case 'billing_address':
        result = {
          ...result,
          ...filterAndConvertObjectToPlainEnglish(value, groupName, checkedBillingAddressState),
        };
        break;
      case 'discount_codes':
        result = {
          ...result,
          ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedDiscountCodesState),
        };
        break;
      case 'shipping_address':
        result = {
          ...result,
          ...filterAndConvertObjectToPlainEnglish(value, groupName, checkedShippingAddressState),
        };
        break;
      case 'shipping_lines':
        result = {
          ...result,
          ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedShippingLinesState),
        };
        break;
      case 'tax_lines':
        result = { ...result, ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedTaxLinesState) };
        break;
      case 'fulfillments':
        result = { ...result, ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedFulfillmentsState) };
        break;
      case 'fulfillment_orders':
        result = {
          ...result,
          ...filterAndConvertArrayToPlainEnglish(value, groupName, checkedFulfillmentOrdersState),
        };
        break;
      default:
        console.log('defaulted');
    }
  }
  return result;
}

function filterAndConvertArrayToPlainEnglish(arrayOfItems, groupName, checkedStateObjectForFiltering) {
  const plainEnglishGroupName = getGroupNameInPlainEnglish(groupName);
  const plainEnglishArrayOfItems = arrayOfItems.map((currentObject) => {
    return filterAndConvertObjectToPlainEnglish(currentObject, groupName, checkedStateObjectForFiltering);
  });
  const result = { [plainEnglishGroupName]: plainEnglishArrayOfItems };
  const flattenedResult = flatten(result, { delimiter: '/' });
  return flattenedResult;
}

function filterAndConvertObjectToPlainEnglish(objectGroup, groupName, checkedStateObjectForFiltering) {
  const flattenedWithGroupName = flattenEachFieldWithGroupName(objectGroup, groupName);
  const filteredFields = filterUsingCheckedFields(checkedStateObjectForFiltering, flattenedWithGroupName);
  const convertedToHumanReadable = convertObjectToPlainEnglish(fieldsSourceData, filteredFields, groupName);
  return convertedToHumanReadable;
}

// Preserves only fields with a corresponding "true" checked state
function filterUsingCheckedFields(checkedStateObjectForFiltering, flattenedGroupObject) {
  const filteredObject = Object.entries(checkedStateObjectForFiltering).reduce((accum, [fieldName, val]) => {
    if (val) accum[fieldName] = flattenedGroupObject[fieldName];
    return accum;
  }, {});
  return filteredObject;
}

// transforms each field into the same signature as represented in the database, so it can be used for filtering later
function flattenEachFieldWithGroupName(groupObject, groupName) {
  const objectWithNamedTopLevel = { [groupName]: groupObject };
  const flattenedGroupObject = flatten(objectWithNamedTopLevel, { delimiter: '__', maxDepth: 2 });
  return flattenedGroupObject;
}

// Simple utility function to convert a group name from something like "line_items" into "Line Items"
function getGroupNameInPlainEnglish(groupName) {
  const plainEnglishGroupName = groupName.split('_').reduce((accum, current) => {
    const shouldAddSpace = accum.length > 0 ? ' ' : '';
    const capitalizedCurrent = current.slice(0, 1).toUpperCase() + current.slice(1);
    return (accum += shouldAddSpace + capitalizedCurrent);
  }, '');
  return plainEnglishGroupName;
}

/**
@param filteredObject takes form of
{
  customer__email: 'bob.norman@mail.example.com',
  customer__first_name: 'Bob'}; 
*/
function convertObjectToPlainEnglish(sourceLookup, filteredObject, groupName) {
  const convertedObject = Object.entries(filteredObject).reduce((accum, [key, value]) => {
    const plainEnglishFieldName = getFieldInPlainEnglish(sourceLookup, groupName, key);
    if (plainEnglishFieldName) accum[plainEnglishFieldName] = value;
    return accum;
  }, {});
  return convertedObject;
}
// This function is needed because the "main" fields are the only ones in the Order data that are
// not nested, and must be handled differently.
function convertObjectToPlainEnglishOnlyMain(mainSourceData, mainFieldsObject) {
  const convertedObject = Object.entries(mainFieldsObject).reduce((accum, [key, value]) => {
    const plainEnglishFieldName = getFieldInPlainEnglishOnlyForMain(mainSourceData, key);
    if (plainEnglishFieldName) accum[plainEnglishFieldName] = value;
    return accum;
  }, {});
  const flattenedResult = flatten(convertedObject, { delimiter: '/', maxDepth: 3 });
  return flattenedResult;
}
// gets readable fields found in nested objects in the Order object, such as "customers", "line_items", etc.
function getFieldInPlainEnglish(sourceLookup, groupName, unformattedFieldName) {
  return sourceLookup[groupName].find((val) => val.value == unformattedFieldName)?.name;
}
// "main" fields are at the top level of the Order object, and not nested.
function getFieldInPlainEnglishOnlyForMain(sourceLookupMain, unformattedFieldName) {
  return sourceLookupMain.find((val) => val.value == unformattedFieldName)?.name;
}

function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}
