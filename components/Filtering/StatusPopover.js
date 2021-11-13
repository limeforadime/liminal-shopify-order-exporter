import { Button, Popover, ChoiceList } from '@shopify/polaris';
import { useCallback, useState } from 'react';

const StatusPopover = ({ addTag, statusChoices }) => {
  const [statusPopoverActive, setStatusPopoverActive] = useState(false);
  const [statusChoiceSelected, setStatusChoiceSelected] = useState(['open']);
  const handleStatusChoiceChange = useCallback((value) => setStatusChoiceSelected(value), []);
  const toggleStatusPopoverActive = useCallback(
    () => setStatusPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const handleAddStatusFilterButton = useCallback(() => {
    try {
      // eg. if given 'open', will return label version of 'Open' as found in statusChoices
      let tagString = `Status: ${statusChoices.find((choice) => choice.value == statusChoiceSelected).label}`;
      addTag(tagString, true);
      toggleStatusPopoverActive();
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Popover
      fullHeight
      preferredAlignment="left"
      active={statusPopoverActive}
      activator={
        <Button disclosure="down" onClick={toggleStatusPopoverActive}>
          Status
        </Button>
      }
      onClose={toggleStatusPopoverActive}
    >
      <Popover.Pane>
        <Popover.Section>
          <ChoiceList
            choices={statusChoices}
            selected={statusChoiceSelected}
            onChange={handleStatusChoiceChange}
          />
        </Popover.Section>
        <Popover.Section>
          <Button primary fullWidth onClick={handleAddStatusFilterButton}>
            Add Filter
          </Button>
        </Popover.Section>
      </Popover.Pane>
    </Popover>
  );
};
export default StatusPopover;
