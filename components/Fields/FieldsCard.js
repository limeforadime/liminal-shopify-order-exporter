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
import React, { useCallback, useEffect, useState } from 'react';
import { fieldData } from '../fieldData';
import styles from './FieldsCard.module.css';

const FieldsCard = () => {
  const [checkedMainState, setCheckedMainState] = useState(new Array(fieldData.main.length).fill(false));
  const [checkedCustomerState, setCheckedCustomerState] = useState(
    new Array(fieldData.customer.length).fill(false)
  );
  const [checkedDiscountCodesState, setCheckedDiscountCodesState] = useState(
    new Array(fieldData.discountCodes.length).fill(false)
  );
  const [openMain, setOpenMain] = useState(true);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openDiscountCodes, setOpenDiscountCodes] = useState(false);
  const handleMainToggle = useCallback(() => setOpenMain((open) => !open), []);
  const handleCustomerToggle = useCallback(() => setOpenCustomer((open) => !open), []);
  const handleDiscountCodesToggle = useCallback(() => setOpenDiscountCodes((open) => !open), []);

  const handleMainChange = (position) => {
    const updatedCheckedState = checkedMainState.map((item, index) => (index === position ? !item : item));
    setCheckedMainState(updatedCheckedState);
  };
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
      <Button
        monochrome
        fullWidth
        disclosure={openMain ? 'up' : 'down'}
        textAlign="left"
        onClick={handleMainToggle}
        ariaExpanded={openMain}
        ariaControls="basic-collapsible"
      >
        Orders
      </Button>

      <Collapsible
        open={openMain}
        id="basic-collapsible"
        transition={{ duration: '450ms', timingFunction: 'ease-in-out' }}
        expandOnPrint
      >
        <Card.Section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              height: '500px',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {fieldData.main.map(({ value, name, description }, index) => {
              return (
                <div key={'main' + index} style={{ display: 'flex', maxWidth: '50%' }}>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      helpText={value}
                      checked={checkedMainState[index]}
                      onChange={() => handleMainChange(index)}
                    />
                    <div className={styles.tooltip}>
                      <Icon source={InfoMinor} color="base" />
                      <div
                        className={styles.tooltiptext}
                        dangerouslySetInnerHTML={{ __html: description }}
                      ></div>
                    </div>
                    {/* <Tooltip content={description}>
                      <div style={{ padding: '4px 7px' }}>
                        <Icon source={InfoMinor} color="base" />
                      </div>
                    </Tooltip> */}
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
        transition={{ duration: '450ms', timingFunction: 'ease-in-out' }}
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
            {fieldData.customer.map(({ value, name, description }, index) => {
              return (
                <div key={'customer' + index} style={{ display: 'flex', maxWidth: '50%' }}>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      helpText={value}
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
                    {/* <Tooltip content={description}>
                      <div style={{ padding: '4px 7px' }}>
                        <Icon source={InfoMinor} color="base" />
                      </div>
                    </Tooltip> */}
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
        transition={{ duration: '450ms', timingFunction: 'ease-in-out' }}
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
            {fieldData.discountCodes.map(({ value, name, description }, index) => {
              return (
                <div key={'discountCode' + index} style={{ display: 'flex', maxWidth: '50%' }}>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      helpText={value}
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
                    {/* <Tooltip content={description}>
                      <div style={{ padding: '4px 7px' }}>
                        <Icon source={InfoMinor} color="base" />
                      </div>
                    </Tooltip> */}
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Section>
      </Collapsible>
    </Card>
    // <Card>
    //   <OptionList
    //     onChange={setSelected}
    //     sections={[
    //       {
    //         options: [
    //           { value: 'type', label: 'Sale item type' },
    //           { value: 'kind', label: 'Sale kind' },
    //         ],
    //       },
    //       {
    //         title: 'Traffic',
    //         options: [
    //           { value: 'source', label: 'Traffic referrer source' },
    //           { value: 'host', label: 'Traffic referrer host' },
    //           { value: 'path', label: 'Traffic referrer path' },
    //         ],
    //       },
    //     ]}
    //     selected={selected}
    //     allowMultiple
    //   />
    // </Card>
  );
};

export default FieldsCard;
