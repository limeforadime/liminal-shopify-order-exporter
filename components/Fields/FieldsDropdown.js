import { Card, Checkbox, Collapsible, Button, Icon } from '@shopify/polaris';
import { InfoMinor } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './FieldsCard.module.css';

const FieldsDropdown = ({
  buttonTitle,
  accessibilityId,
  height,
  initialOpenState,
  sourceData,
  checkedState,
  setCheckedState,
}) => {
  const [openState, setOpenState] = useState(initialOpenState);
  const [totalChecked, setTotalChecked] = useState(checkedState.filter((val) => val == true).length);

  const handleChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    setCheckedState(updatedCheckedState);
  };
  const handleToggle = useCallback(() => setOpenState((open) => !open), []);
  const handleSelectAll = useCallback(() => {
    let atLeastOneTrue = checkedState.some((val) => val == true);
    if (atLeastOneTrue) {
      let allTrue = checkedState.every((val) => val == true);
      if (allTrue) setCheckedState(new Array(checkedState.length).fill(false));
      else setCheckedState(new Array(checkedState.length).fill(true));
    } else {
      setCheckedState(new Array(checkedState.length).fill(true));
    }
  });
  useEffect(() => {
    setTotalChecked(checkedState.filter((val) => val == true).length);
  }, [checkedState]);

  return (
    <>
      <Button
        monochrome
        fullWidth
        disclosure={openState ? 'up' : 'down'}
        textAlign="left"
        onClick={handleToggle}
        ariaExpanded={openState}
        ariaControls={accessibilityId}
      >
        {buttonTitle} ({totalChecked})
      </Button>

      <Collapsible
        open={openState}
        id={accessibilityId}
        transition={{ duration: '250ms', timingFunction: 'ease-in-out' }}
        expandOnPrint
      >
        <Card.Section subdued>
          <Checkbox checked="indeterminate" label="Select/Deselect All" onChange={handleSelectAll} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              height: height,
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            {sourceData.map(({ value, name, description }, index) => {
              return (
                <div key={index} style={{ display: 'flex', maxWidth: '50%' }}>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      checked={checkedState[index]}
                      onChange={() => handleChange(index)}
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
    </>
  );
};
export default FieldsDropdown;
