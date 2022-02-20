import { Card } from '@shopify/polaris';
import React, { useContext } from 'react';
import { fieldsSourceData } from './fieldsData';
import FieldsDropdown from './FieldsDropdown';
import { FieldsStateContext } from './FieldsStateWrapper';

const FieldsCard = () => {
  const fieldsState = useContext(FieldsStateContext);

  return (
    <Card title="Select Fields" sectioned>
      <FieldsDropdown
        buttonTitle="Order Fields"
        accessibilityId={'main-fields-dropdown'}
        height="320px"
        initialOpenState={true}
        sourceData={fieldsSourceData.main}
        checkedState={fieldsState.checkedMainState}
        setCheckedState={fieldsState.setCheckedMainState}
      />
      <FieldsDropdown
        buttonTitle="Customer"
        accessibilityId={'customer-fields-dropdown'}
        height="125px"
        initialOpenState={false}
        sourceData={fieldsSourceData.customer}
        checkedState={fieldsState.checkedCustomerState}
        setCheckedState={fieldsState.setCheckedCustomerState}
      />
      <FieldsDropdown
        buttonTitle="Line Items"
        accessibilityId={'line-items-fields-dropdown'}
        height="320px"
        initialOpenState={false}
        sourceData={fieldsSourceData.lineItems}
        checkedState={fieldsState.checkedLineItemsState}
        setCheckedState={fieldsState.setCheckedLineItemsState}
      />
      <FieldsDropdown
        buttonTitle="Transactions"
        accessibilityId={'transactions-fields-dropdown'}
        height="130px"
        initialOpenState={false}
        sourceData={fieldsSourceData.transactions}
        checkedState={fieldsState.checkedTransactionsState}
        setCheckedState={fieldsState.setCheckedTransactionsState}
      />
      <FieldsDropdown
        buttonTitle="Billing Address"
        accessibilityId={'billing-address-fields-dropdown'}
        height="250px"
        initialOpenState={false}
        sourceData={fieldsSourceData.billingAddress}
        checkedState={fieldsState.checkedBillingAddressState}
        setCheckedState={fieldsState.setCheckedBillingAddressState}
      />
      <FieldsDropdown
        buttonTitle="Discount Codes"
        accessibilityId={'discount-codes-fields-dropdown'}
        height="120px"
        initialOpenState={false}
        sourceData={fieldsSourceData.discountCodes}
        checkedState={fieldsState.checkedDiscountCodesState}
        setCheckedState={fieldsState.setCheckedDiscountCodesState}
      />
      <FieldsDropdown
        buttonTitle="Shipping Address"
        accessibilityId={'shipping-address-fields-dropdown'}
        height="250px"
        initialOpenState={false}
        sourceData={fieldsSourceData.shippingAddress}
        checkedState={fieldsState.checkedShippingAddressState}
        setCheckedState={fieldsState.setCheckedShippingAddressState}
      />
      <FieldsDropdown
        buttonTitle="Shipping Lines"
        accessibilityId={'shipping-lines-fields-dropdown'}
        height="150px"
        initialOpenState={false}
        sourceData={fieldsSourceData.shippingLines}
        checkedState={fieldsState.checkedShippingLinesState}
        setCheckedState={fieldsState.setCheckedShippingLinesState}
      />
      <FieldsDropdown
        buttonTitle="Tax Lines"
        accessibilityId={'tax-lines-fields-dropdown'}
        height="120px"
        initialOpenState={false}
        sourceData={fieldsSourceData.taxLines}
        checkedState={fieldsState.checkedTaxLinesState}
        setCheckedState={fieldsState.setCheckedTaxLinesState}
      />
      <FieldsDropdown
        buttonTitle="Fulfillment"
        accessibilityId={'fulfillment-fields-dropdown'}
        height="130px"
        initialOpenState={false}
        sourceData={fieldsSourceData.fulfillments}
        checkedState={fieldsState.checkedFulfillmentsState}
        setCheckedState={fieldsState.setCheckedFulfillmentsState}
      />
      <FieldsDropdown
        buttonTitle="Fulfillment Orders"
        accessibilityId={'fulfillment-orders-fields-dropdown'}
        height="130px"
        initialOpenState={false}
        sourceData={fieldsSourceData.fulfillmentOrders}
        checkedState={fieldsState.checkedFulfillmentOrdersState}
        setCheckedState={fieldsState.setCheckedFulfillmentOrdersState}
      />
    </Card>
  );
};

export default FieldsCard;
