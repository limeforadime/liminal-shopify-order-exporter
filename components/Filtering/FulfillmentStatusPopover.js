import { Button, Popover, ChoiceList } from '@shopify/polaris';
import { useCallback, useState } from 'react';

const FulfillmentStatusPopover = ({ addTag, fulfillmentStatusChoices }) => {
  const [fulfillmentStatusPopoverActive, setFulfillmentStatusPopoverActive] = useState(false);
  const [fulfillmentStatusChoiceSelected, setFulfillmentStatusChoiceSelected] = useState([]);
  const handleFulfillmentStatusChoiceChange = useCallback(
    (value) => setFulfillmentStatusChoiceSelected(value),
    []
  );
  const toggleFulfillmentStatusPopoverActive = useCallback(
    () => setFulfillmentStatusPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const handleAddFulfillmentStatusFilterButton = useCallback(() => {
    try {
      let tagString = 'Fulfillment status: ';
      let formattedChoiceArray = fulfillmentStatusChoiceSelected
        .map((selected) => fulfillmentStatusChoices.find((choice) => choice.value == selected).label)
        .join(', ');
      tagString += formattedChoiceArray;
      addTag(tagString, true);
      toggleFulfillmentStatusPopoverActive();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Popover
      fullHeight
      preferredAlignment="left"
      active={fulfillmentStatusPopoverActive}
      activator={
        <Button disclosure="down" onClick={toggleFulfillmentStatusPopoverActive}>
          Fulfillment status
        </Button>
      }
      onClose={toggleFulfillmentStatusPopoverActive}
    >
      <Popover.Pane>
        <Popover.Section>
          <ChoiceList
            allowMultiple
            choices={fulfillmentStatusChoices}
            selected={fulfillmentStatusChoiceSelected}
            onChange={handleFulfillmentStatusChoiceChange}
          />
        </Popover.Section>
        <Popover.Section>
          <Button
            primary
            fullWidth
            onClick={handleAddFulfillmentStatusFilterButton}
            disabled={fulfillmentStatusChoiceSelected.length == 0}
          >
            Add Filter
          </Button>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
};
export default FulfillmentStatusPopover;
