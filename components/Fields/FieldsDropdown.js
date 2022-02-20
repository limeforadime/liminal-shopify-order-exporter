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
  const [totalChecked, setTotalChecked] = useState(
    Object.values(checkedState).filter((val) => val == true).length
  );
  const [minWidthMatches, setMinWidthMatches] = useState(false);

  // Performs conversion from object to array back to object in order to invert the selected key's value
  const handleChange = (position) => {
    const updatedCheckedState = Object.fromEntries(
      Object.entries(checkedState).map(([key, value], index) => {
        return [key, index === position ? !value : value];
      })
    );
    setCheckedState(updatedCheckedState);
  };
  const handleToggle = useCallback(() => setOpenState((open) => !open), []);

  const handleSelectAll = useCallback(() => {
    let atLeastOneTrue = Object.values(checkedState).some((val) => val == true);
    if (atLeastOneTrue) {
      let allTrue = Object.values(checkedState).every((val) => val == true);
      if (allTrue) {
        const updatedStateToAllFalse = Object.fromEntries(
          Object.entries(checkedState).map(([key]) => {
            return [key, false];
          })
        );
        setCheckedState(updatedStateToAllFalse);
      } else {
        const updatedStateToAllTrue = Object.fromEntries(
          Object.entries(checkedState).map(([key]) => {
            return [key, true];
          })
        );
        setCheckedState(updatedStateToAllTrue);
      }
    } else {
      const updatedStateToAllTrue = Object.fromEntries(
        Object.entries(checkedState).map(([key]) => {
          return [key, true];
        })
      );
      setCheckedState(updatedStateToAllTrue);
    }
  });

  useEffect(() => {
    window.matchMedia('(min-width: 35em)').addEventListener('change', (e) => setMinWidthMatches(e.matches));
  }, []);
  useEffect(() => {
    setTotalChecked(Object.values(checkedState).filter((val) => val == true).length);
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
            id={accessibilityId}
            className={styles.checkboxContainer}
            style={{ height: minWidthMatches && height }}
          >
            {sourceData.map(({ value, name, description }, index) => {
              return (
                <div key={index} /* style={{ display: 'flex', maxWidth: '50%' }} */>
                  <div style={{ display: 'flex' }}>
                    <Checkbox
                      label={name}
                      checked={Object.values(checkedState)[index]}
                      onChange={() => handleChange(index)}
                    />
                    <div className={styles.tooltip}>
                      <Icon source={InfoMinor} color="base" />
                      <div className={styles.tooltiptext} dangerouslySetInnerHTML={{ __html: description }}></div>
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
