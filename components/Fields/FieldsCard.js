import {
  Tag,
  Card,
  Checkbox,
  Collapsible,
  OptionList,
  Button,
  Tooltip,
  Icon,
  ButtonGroup,
  Stack,
  TextContainer,
  Popover,
  ChoiceList,
  Subheading,
  Layout,
} from '@shopify/polaris';
import { InfoMinor } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { fieldsSourceData } from './fieldsData';
import styles from './FieldsCard.module.css';
import FieldsDropdown from './FieldsDropdown';
import { FieldsStateContext } from './FieldsStateWrapper';

const FieldsCard = () => {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openDiscountCodes, setOpenDiscountCodes] = useState(false);
  const fieldsState = useContext(FieldsStateContext);

  const handleCustomerToggle = useCallback(() => setOpenCustomer((open) => !open), []);
  const handleDiscountCodesToggle = useCallback(() => setOpenDiscountCodes((open) => !open), []);

  const handleCustomerChange = (position) => {
    const updatedCheckedState = checkedCustomerState.map((item, index) => (index === position ? item : item));
    setCheckedCustomerState(updatedCheckedState);
  };
  const handleDiscountCodesChange = (position) => {
    const updatedCheckedState = checkedDiscountCodesState.map((item, index) =>
      index === position ? item : item
    );
    setCheckedDiscountCodesState(updatedCheckedState);
  };

  return (
    <Card title="Select Fields" sectioned>
      <FieldsDropdown
        buttonTitle="Order Fields"
        accessibilityId={'main-fields-dropdown'}
        height="300px"
        initialOpenState={true}
        sourceData={fieldsSourceData.main}
        checkedState={fieldsState.checkedMainState}
        setCheckedState={fieldsState.setCheckedMainState}
      />
      <FieldsDropdown
        buttonTitle="Customer"
        accessibilityId={'customer-fields-dropdown'}
        height="100px"
        initialOpenState={false}
        sourceData={fieldsSourceData.customer}
        checkedState={fieldsState.checkedCustomerState}
        setCheckedState={fieldsState.setCheckedCustomerState}
      />
      <FieldsDropdown
        buttonTitle="Line Items"
        accessibilityId={'line-items-fields-dropdown'}
        height="300px"
        initialOpenState={false}
        sourceData={fieldsSourceData.lineItems}
        checkedState={fieldsState.checkedLineItemsState}
        setCheckedState={fieldsState.setCheckedLineItemsState}
      />
      <FieldsDropdown
        buttonTitle="Transactions"
        accessibilityId={'transactions-fields-dropdown'}
        height="120px"
        initialOpenState={false}
        sourceData={fieldsSourceData.transactions}
        checkedState={fieldsState.checkedTransactionsState}
        setCheckedState={fieldsState.setCheckedTransactionsState}
      />
      <FieldsDropdown
        buttonTitle="Billing Address"
        accessibilityId={'billing-address-fields-dropdown'}
        height="240px"
        initialOpenState={false}
        sourceData={fieldsSourceData.billingAddress}
        checkedState={fieldsState.checkedBillingAddressState}
        setCheckedState={fieldsState.setCheckedBillingAddressState}
      />
      <FieldsDropdown
        buttonTitle="Discount Codes"
        accessibilityId={'discount-codes-fields-dropdown'}
        height="100px"
        initialOpenState={false}
        sourceData={fieldsSourceData.discountCodes}
        checkedState={fieldsState.checkedDiscountCodesState}
        setCheckedState={fieldsState.setCheckedDiscountCodesState}
      />
      <FieldsDropdown
        buttonTitle="Shipping Address"
        accessibilityId={'shipping-address-fields-dropdown'}
        height="240px"
        initialOpenState={false}
        sourceData={fieldsSourceData.shippingAddress}
        checkedState={fieldsState.checkedShippingAddressState}
        setCheckedState={fieldsState.setCheckedShippingAddressState}
      />
      <FieldsDropdown
        buttonTitle="Shipping Lines"
        accessibilityId={'shipping-lines-fields-dropdown'}
        height="140px"
        initialOpenState={false}
        sourceData={fieldsSourceData.shippingLines}
        checkedState={fieldsState.checkedShippingLinesState}
        setCheckedState={fieldsState.setCheckedShippingLinesState}
      />
      <FieldsDropdown
        buttonTitle="Tax Lines"
        accessibilityId={'tax-lines-fields-dropdown'}
        height="100px"
        initialOpenState={false}
        sourceData={fieldsSourceData.taxLines}
        checkedState={fieldsState.checkedTaxLinesState}
        setCheckedState={fieldsState.setCheckedTaxLinesState}
      />
      <FieldsDropdown
        buttonTitle="Fulfillment"
        accessibilityId={'fulfillment-fields-dropdown'}
        height="120px"
        initialOpenState={false}
        sourceData={fieldsSourceData.fulfillment}
        checkedState={fieldsState.checkedFulfillmentState}
        setCheckedState={fieldsState.setCheckedFulfillmentState}
      />

      {/* <Button
        monochrome
        fullWidth
        disclosure={openCustomer ? 'up' : 'down'}
        textAlign="left"
        onClick={handleCustomerToggle}
        ariaExpanded={openCustomer}
        ariaControls="basic-collapsible"
      >
        Customer
      </Button>
      <Collapsible
        open={openCustomer}
        id="basic-collapsible"
        transition={{ duration: '250ms', timingFunction: 'ease-in-out' }}
        expandOnPrint
      >
        <Card.Section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              height: '180px',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {fieldsSourceData.customer.map(({ value, name, description }, index) => {
              return (
                <div key={'customer' + index} style={{ display: 'flex', maxWidth: '50%' }}>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      checked={checkedCustomerState[index]}
                      onChange={handleCustomerChange}
                    />
                    <div className={styles.tooltip}>
                      <Icon source={InfoMinor} color="base" />
                      <div
                        className={styles.tooltiptext}
                        dangerouslySetInnerHTML={{ __html: description }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Section>
      </Collapsible>

      <Button
        monochrome
        fullWidth
        disclosure={openDiscountCodes ? 'up' : 'down'}
        textAlign="left"
        onClick={handleDiscountCodesToggle}
        ariaExpanded={openDiscountCodes}
        ariaControls="basic-collapsible"
      >
        Discount Codes
      </Button>
      <Collapsible
        open={openDiscountCodes}
        id="basic-collapsible"
        transition={{ duration: '250ms', timingFunction: 'ease-in-out' }}
        expandOnPrint
      >
        <Card.Section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              height: '180px',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {fieldsSourceData.discountCodes.map(({ value, name, description }, index) => {
              return (
                <div key={'discountCode' + index} style={{ display: 'flex', maxWidth: '50%' }}>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      checked={checkedDiscountCodesState[index]}
                      onChange={handleDiscountCodesChange}
                    />
                    <div className={styles.tooltip}>
                      <Icon source={InfoMinor} color="base" />
                      <div
                        className={styles.tooltiptext}
                        dangerouslySetInnerHTML={{ __html: description }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Section>
      </Collapsible> */}
    </Card>
  );
};

export default FieldsCard;
